import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RolePermissionsResponseDto } from './dtos/response-role-permissions.dto';
import { IRole } from 'src/common/types/permission.types';
import { IWarehouse } from '../warehouses/types/warehouse.types';
import { ILocation } from 'src/common/types/location.types';
import { IPermission } from '../permissions/types/permission.types';
import { IRolePermission } from '../permissions/types/permission.types';
import { CreateRolePermissionsDto } from './dtos/create-role-permissions.dto';

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getAllRolesPermissions() {
    const listPermissions = await this.prisma.permission_role.findMany({});
    if (listPermissions.length === 0) throw new NotFoundException();
    const groupedByRole = listPermissions.reduce(
      (
        acc: Record<string, Partial<RolePermissionsResponseDto>>,
        elem: IRolePermission,
      ) => {
        const { permissionId, roleId, warehouseId, locationId, comment } = elem;
        const key = `${roleId}_${locationId ?? 'null'}_${warehouseId ?? 'null'}`;
        if (!acc[key]) {
          acc[key] = {
            roleId,
            locationId,
            comment,
            warehouseId: warehouseId ?? '',
            permissionIds: permissionId ? [permissionId] : [],
          };
        } else if (permissionId) {
          acc[key].permissionIds.push(permissionId);
        }
        return acc;
      },
      {} as Record<string, Partial<RolePermissionsResponseDto>>,
    );

    const groupedArray: Partial<RolePermissionsResponseDto>[] =
      Object.values(groupedByRole);
    const uniqueRoleIds = [
      ...new Set(groupedArray.map((r: RolePermissionsResponseDto) => r.roleId)),
    ];
    const uniqueWarehouseIds = [
      ...new Set(
        groupedArray
          .map((w: RolePermissionsResponseDto) => w.warehouseId)
          .filter(Boolean),
      ),
    ];
    const uniqueLocationIds = [
      ...new Set(
        groupedArray
          .map((l: RolePermissionsResponseDto) => l.locationId)
          .filter(Boolean),
      ),
    ];
    const uniquePermissionIds = [
      ...new Set(
        groupedArray
          .flatMap((p: RolePermissionsResponseDto) => p.permissionIds)
          .filter(Boolean),
      ),
    ];

    const [roles, warehouses, locations, permissions] = await Promise.all([
      this.prisma.role.findMany({
        where: { id: { in: uniqueRoleIds } },
      }),
      this.prisma.warehouse.findMany({
        where: { id: { in: uniqueWarehouseIds } },
      }),
      this.prisma.location.findMany({
        where: { id: { in: uniqueLocationIds } },
      }),
      this.prisma.permission.findMany({
        where: { id: { in: uniquePermissionIds } },
        select: { id: true, name: true },
      }),
    ]);

    if (roles.length === 0 || locations.length === 0) {
      throw new NotFoundException('Required roles or locations not found');
    }

    const roleMap: Map<string, IRole> = new Map(
      roles.map((r: IRole) => [r.id, r]),
    );
    const warehouseMap: Map<string, IWarehouse> = new Map(
      warehouses.map((w: IWarehouse) => [w.id, w]),
    );
    const locationMap: Map<string, ILocation> = new Map(
      locations.map((l: ILocation) => [l.id, l]),
    );
    const permissionsMap: Map<string, IPermission> = new Map(
      permissions.map((p: IPermission) => [p.id, p]),
    );

    return groupedArray.map(
      ({ roleId, warehouseId, locationId, permissionIds }) => ({
        roleId,
        roleName: roleMap.get(roleId)?.name ?? null,
        comment: roleMap.get(roleId)?.comment ?? null,
        warehouseName: warehouseId
          ? (warehouseMap.get(warehouseId)?.name ?? '')
          : '',
        warehouseId: warehouseId
          ? (warehouseMap.get(warehouseId)?.id ?? '')
          : '',
        locationName: locationMap.get(locationId)?.name ?? null,
        locationId: locationMap.get(locationId)?.id ?? null,
        permissionsName:
          permissionIds.length > 0
            ? (permissionIds
                .map((id) => permissionsMap.get(id)?.name)
                .filter(Boolean) as string[])
            : [],
        permissionIds:
          permissionIds.length > 0
            ? (permissionIds
                .map((id) => permissionsMap.get(id)?.id)
                .filter(Boolean) as string[])
            : [],
      }),
    );
  }
  // Create and Update
  async createUpdateRolePermissions(
    rolePermissionsDto: CreateRolePermissionsDto,
  ) {
    const {
      locationId,
      oldLocationId,
      warehouseId,
      oldWarehouseId,
      permissionIds,
      roleId,
      roleName,
      comment,
    } = rolePermissionsDto;

    const currentLocationId = locationId || oldLocationId;
    const currentWarehouseId =
      roleName !== 'manager' ? warehouseId || oldWarehouseId : null;

    // Get all current permission_role from this role, location, warehouse
    const existingPermissionRoles = await this.prisma.permission_role.findMany({
      where: {
        roleId,
        locationId: currentLocationId,
        warehouseId: currentWarehouseId,
      },
    });

    const existingPermissionIds = new Set(
      existingPermissionRoles.map((item) => item.permissionId),
    );
    const newPermissionIds = new Set(permissionIds);

    // Get new permissions and delete old
    const permissionIdsToAdd = [...newPermissionIds].filter(
      (id) => !existingPermissionIds.has(id),
    );
    const permissionRolesToDelete = existingPermissionRoles.filter(
      (item) => item.permissionId && !newPermissionIds.has(item.permissionId),
    );

    if (comment) {
      await this.prisma.permission_role.updateMany({
        where: {
          roleId,
          locationId: currentLocationId,
          warehouseId: currentWarehouseId,
        },
        data: { comment },
      });
    }

    // Delete unusable permission_role
    const idsToDelete = permissionRolesToDelete.map((item) => item.id);
    const usedPermissionRoles = await this.prisma.user_role.findMany({
      where: { permissionRoleId: { in: idsToDelete } },
      select: { permissionRoleId: true },
    });

    const usedIds = new Set(
      usedPermissionRoles.map((item) => item.permissionRoleId),
    );
    const deletableIds = idsToDelete.filter((id) => !usedIds.has(id));

    if (deletableIds.length > 0) {
      await this.prisma.permission_role.deleteMany({
        where: { id: { in: deletableIds } },
      });
    }

    // Add new permission_role
    const newPermissionRoleData = permissionIdsToAdd.map((permissionId) => ({
      permissionId,
      roleId,
      locationId: currentLocationId,
      warehouseId: currentWarehouseId,
      comment: comment ?? '',
    }));

    if (newPermissionRoleData.length > 0) {
      await this.prisma.permission_role.createMany({
        data: newPermissionRoleData,
        skipDuplicates: true,
      });
    }

    // Sync user_role after update permission_role
    const userRolesToSync = await this.prisma.user_role.findMany({
      where: { roleId },
      include: { permissionRole: true },
    });

    const filteredUserRoles = userRolesToSync.filter(
      (role) =>
        role.permissionRole.locationId === currentLocationId &&
        role.permissionRole.warehouseId === currentWarehouseId,
    );

    if (filteredUserRoles.length > 0) {
      await this.prisma.user_role.deleteMany({
        where: {
          id: { in: filteredUserRoles.map((role) => role.id) },
        },
      });

      const updatedPermissionRoles = await this.prisma.permission_role.findMany(
        {
          where: {
            roleId,
            locationId: currentLocationId,
            warehouseId: currentWarehouseId,
            permissionId: { in: permissionIds },
          },
        },
      );

      const permissionRoleMap = new Map(
        updatedPermissionRoles.map((permission) => [
          permission.permissionId!,
          permission.id,
        ]),
      );

      const newUserRoles = [];
      for (const role of filteredUserRoles) {
        for (const permId of permissionIds) {
          const permissionRoleId = permissionRoleMap.get(permId);
          if (permissionRoleId) {
            newUserRoles.push({
              userId: role.userId,
              roleId,
              permissionRoleId,
            });
          }
        }
      }

      if (newUserRoles.length > 0) {
        await this.prisma.user_role.createMany({
          data: newUserRoles,
          skipDuplicates: true,
        });
      }
    }

    // Role manager without permissions
    if (roleName === 'manager' && permissionIds.length === 0) {
      const existingManager = await this.prisma.permission_role.findFirst({
        where: {
          roleId,
          locationId,
          warehouseId: null,
          permissionId: null,
        },
      });

      if (existingManager) {
        await this.prisma.permission_role.update({
          where: { id: existingManager.id },
          data: { comment: comment ?? '' },
        });
      } else {
        await this.prisma.permission_role.create({
          data: {
            roleId,
            locationId,
            warehouseId: null,
            permissionId: null,
            comment: comment ?? '',
          },
        });
      }
    }
  }
}
