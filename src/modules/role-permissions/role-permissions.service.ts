import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  RolePermissionsDto,
  RolePermissionsResponseDto,
} from './dtos/role-permissions.dto';
import { IRole } from 'src/common/types/permission.types';
import { IWarehouse } from '../warehouses/types/warehouse.types';
import { ILocation } from 'src/common/types/location.types';
import { IPermission } from '../permissions/types/permission.types';

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getAllRolesPermissions() {
    const listPermissions = await this.prisma.permission_role.findMany({});
    if (listPermissions.length === 0) throw new NotFoundException();
    const groupedByRole = listPermissions.reduce(
      (acc, elem) => {
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

    const roleMap: Map<string, IRole> = new Map(roles.map((r) => [r.id, r]));
    const warehouseMap: Map<string, IWarehouse> = new Map(
      warehouses.map((w) => [w.id, w]),
    );
    const locationMap: Map<string, ILocation> = new Map(
      locations.map((l) => [l.id, l]),
    );
    const permissionsMap: Map<string, IPermission> = new Map(
      permissions.map((p) => [p.id, p]),
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
        permissionName:
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
  // // Permissions by role
  // async getPermissionsByRole(id: string): Promise<RolePermissionsResponseDto> {
  //   const existingRolePerms = await this.prisma.permission_role.findMany({
  //     where: { roleId: id.trim() },
  //   });
  //   console.log(existingRolePerms)
  //   if (existingRolePerms.length === 0)
  //     return new RolePermissionsResponseDto({ roleId: id.trim() });

  //   const rolePermissions = existingRolePerms.reduce(
  //     (acc, elem) => {
  //       const { permissionId, ...rest } = elem;
  //       if (!acc[rest.roleId]) {
  //         acc[rest.roleId] = { ...rest, permissionIds: [] };
  //       }
  //       acc[rest.roleId].permissionIds.push(permissionId);
  //       return acc;
  //     },
  //     {} as Record<string, Partial<RolePermissionsResponseDto>>,
  //   );

  //   const permissionData = Object.values(rolePermissions)[0];
  //   const roleName = await this.prisma.role.findUnique({
  //     where: { id: permissionData.roleId },
  //   });
  //   let location = null;
  //   let warehouse = null;
  //   let permissions: { name: string }[] = [];

  //   if (roleName.name === 'manager') {
  //     location = await this.prisma.location.findUnique({
  //       where: { id: permissionData.locationId?.trim() },
  //     });
  //   } else {
  //     const [loc, war, perms] = await Promise.all([
  //       permissionData.locationId?.trim()
  //         ? this.prisma.location.findUnique({
  //             where: { id: permissionData.locationId },
  //           })
  //         : Promise.resolve(null),
  //       permissionData.warehouseId?.trim()
  //         ? this.prisma.warehouse.findMany({
  //             where: { id: permissionData.warehouseId?.trim() },
  //           })
  //         : Promise.resolve(null),
  //       permissionData.permissionIds.length > 0
  //         ? this.prisma.permission.findMany({
  //             where: { id: { in: permissionData.permissionIds } },
  //             select: { name: true },
  //           })
  //         : Promise.resolve([]),
  //     ]);
  //     location = loc;
  //     warehouse = war;
  //     permissions = perms;
  //   }

  //   const rolesName = permissions.map((item) => item.name);
  //   if (roleName.name === 'manager') {
  //     return {
  //       ...(permissionData as RolePermissionsResponseDto),
  //       locationName: location.name ?? '',
  //     };
  //   } else {
  //     return {
  //       ...(permissionData as RolePermissionsResponseDto),
  //       locationName: location?.name ?? '',
  //       locationId: location.id ?? '',
  //       warehouseName: warehouse.name ?? '',
  //       permissionName: rolesName,
  //     };
  //   }
  // }
  // Create and Update
  async createUpdateRolePermissions(rolePermissionsDto: RolePermissionsDto) {
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

    const trimmedLocationId = locationId?.trim();
    const trimmedOldLocationId = oldLocationId?.trim();
    const trimmedWarehouseId = warehouseId?.trim() ?? null;
    const trimmedOldWarehouseId = oldWarehouseId?.trim() ?? null;
    const trimmedRoleId = roleId?.trim();
    const trimmedRoleName = roleName?.trim();

    const deleteWhere = {
      roleId: trimmedRoleId,
      locationId: trimmedOldLocationId || trimmedLocationId,
      ...(trimmedRoleName !== 'manager' && {
        warehouseId: trimmedOldWarehouseId || trimmedWarehouseId,
      }),
    };

    if (trimmedRoleName === 'manager') {
      const existingPermission = await this.prisma.permission_role.findFirst({
        where: {
          roleId: trimmedRoleId,
          locationId: trimmedOldLocationId || trimmedLocationId,
          warehouseId: null,
        },
      });
      if (existingPermission) {
        await this.prisma.permission_role.update({
          where: { id: existingPermission.id },
          data: {
            roleId: trimmedRoleId,
            locationId: trimmedLocationId,
            warehouseId: null,
            comment,
          },
        });
      } else {
        await this.prisma.permission_role.create({
          data: {
            permissionId: null,
            roleId: trimmedRoleId,
            locationId: trimmedLocationId,
            warehouseId: null,
            comment,
          },
        });
      }
    } else {
      await this.prisma.permission_role.deleteMany({
        where: deleteWhere,
      });
      const permissionRoleModel = permissionIds.map((permissionId) => ({
        permissionId,
        roleId: trimmedRoleId,
        locationId: trimmedLocationId,
        warehouseId: trimmedWarehouseId,
        comment,
      }));
      if (permissionIds.length > 0) {
        await this.prisma.permission_role.createMany({
          data: permissionRoleModel,
          skipDuplicates: true,
        });
      }
    }
  }
}
