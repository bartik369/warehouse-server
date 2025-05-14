import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  RolePermissionsDto,
  RolePermissionsResponseDto,
} from './dtos/role-permissions.dto';
import { RolePermissionExistException } from 'src/exceptions/permissions.exceptions';

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

    const groupedArray = Object.values(groupedByRole);
    const uniqueRoleIds = [...new Set(groupedArray.map((r) => r.roleId))];
    const uniqueWarehouseIds = [
      ...new Set(groupedArray.map((w) => w.warehouseId).filter(Boolean)),
    ];
    const uniqueLocationIds = [
      ...new Set(groupedArray.map((l) => l.locationId).filter(Boolean)),
    ];
    const uniquePermissionIds = [
      ...new Set(groupedArray.flatMap((p) => p.permissionIds).filter(Boolean)),
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

    const roleMap = new Map(roles.map((r) => [r.id, r]));
    const warehouseMap = new Map(warehouses.map((w) => [w.id, w]));
    const locationMap = new Map(locations.map((l) => [l.id, l]));
    const permissionsMap = new Map(permissions.map((p) => [p.id, p]));

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
  // Permissions by role
  async getPermissionsByRole(id: string) {
    const existingRolePerms = await this.prisma.permission_role.findMany({
      where: { roleId: id.trim() },
    });
    if (existingRolePerms.length === 0)
      return new RolePermissionsResponseDto({ roleId: id.trim() });

    const rolePermissions = existingRolePerms.reduce(
      (acc, elem) => {
        const { permissionId, ...rest } = elem;
        if (!acc[rest.roleId]) {
          acc[rest.roleId] = { ...rest, permissionIds: [] };
        }
        acc[rest.roleId].permissionIds.push(permissionId);
        return acc;
      },
      {} as Record<string, Partial<RolePermissionsResponseDto>>,
    );

    const permissionData = Object.values(rolePermissions)[0];
    const roleName = await this.prisma.role.findUnique({
      where: { id: permissionData.roleId },
    });
    let location = null;
    let warehouse = null;
    let permissions: { name: string }[] = [];

    if (roleName.name === 'manager') {
      location = await this.prisma.location.findUnique({
        where: { id: permissionData.locationId?.trim() },
      });
    } else {
      const [loc, war, perms] = await Promise.all([
        permissionData.locationId?.trim()
          ? this.prisma.location.findUnique({
              where: { id: permissionData.locationId },
            })
          : Promise.resolve(null),
        permissionData.warehouseId?.trim()
          ? this.prisma.warehouse.findMany({
              where: { id: permissionData.warehouseId?.trim() },
            })
          : Promise.resolve(null),
        permissionData.permissionIds.length > 0
          ? this.prisma.permission.findMany({
              where: { id: { in: permissionData.permissionIds } },
              select: { name: true },
            })
          : Promise.resolve([]),
      ]);
      location = loc;
      warehouse = war;
      permissions = perms;
    }

    const rolesName = permissions.map((item) => item.name);
    if (roleName.name === 'manager') {
      return {
        ...permissionData,
        locationName: location.name ?? '',
      };
    } else {
      return {
        ...permissionData,
        locationName: location.name ?? '',
        locationId: location.id ?? '',
        warehouseName: warehouse.name ?? '',
        permissionName: rolesName,
      };
    }
  }

  // Create
  async createRolePermissions(rolePermissionsDto: RolePermissionsDto) {
    const {
      roleId,
      roleName,
      locationId,
      permissionIds,
      warehouseId,
      comment,
    } = rolePermissionsDto;

    const trimmedRoleId = roleId?.trim();
    const trimmedLocationId = locationId?.trim();
    const trimmedWarehouseId = warehouseId?.trim() ?? null;
    const existingRolePerms = await this.prisma.permission_role.findMany({
      where: {
        roleId: trimmedRoleId,
        locationId: trimmedLocationId,
        warehouseId: trimmedWarehouseId,
      },
    });
    if (roleName === 'manager') {
      const exist = existingRolePerms.some(
        (item) => item.locationId === trimmedLocationId,
      );
      if (exist) {
        throw new RolePermissionExistException();
      }
      await this.prisma.permission_role.create({
        data: {
          permissionId: null,
          roleId: trimmedRoleId,
          locationId: trimmedLocationId,
          warehouseId: null,
          comment,
        },
      });
      return;
    } else {
      await this.prisma.permission_role.deleteMany({
        where: {
          roleId: trimmedRoleId,
          locationId: trimmedLocationId,
          warehouseId: trimmedWarehouseId,
        },
      });
      const permissionRoleModel = permissionIds.map((permissionId) => ({
        permissionId,
        roleId: trimmedRoleId,
        locationId: trimmedLocationId,
        warehouseId: trimmedWarehouseId,
        comment,
      }));
      await this.prisma.permission_role.createMany({
        data: permissionRoleModel,
        skipDuplicates: true,
      });
    }
  }

  // Update
  async updateRolePermissions(rolePermissionsDto: RolePermissionsDto) {
    const { roleId, locationId, warehouseId, roleName } = rolePermissionsDto;
    const trimmedRoleId = roleId?.trim();
    const trimmedLocationId = locationId?.trim();
    const trimmedWarehouseId = warehouseId?.trim() ?? null;

    this.rewritePermsData(trimmedRoleId, trimmedLocationId, trimmedWarehouseId);

    if (roleName?.trim().length > 0 && roleName !== 'manager') {
      const [location, warehouse, role] = await Promise.all([
        this.prisma.location.findUnique({
          where: { id: trimmedLocationId },
        }),
        this.prisma.warehouse.findUnique({
          where: { id: trimmedWarehouseId },
        }),
        this.prisma.role.findUnique({
          where: { id: trimmedRoleId },
        }),
      ]);

      if (!location || !warehouse || !role) throw new ConflictException();
      const existingRolePerms = await this.prisma.permission_role.findMany({
        where: {
          roleId: role.id,
          locationId: location.id,
          warehouseId: warehouse.id,
        },
      });
      if (existingRolePerms) {
        await this.prisma.permission_role.deleteMany({
          where: {
            roleId: role.id,
            locationId: location.id,
            warehouseId: warehouse.id,
          },
        });
      }
      const permsRoleModel = rolePermissionsDto.permissionIds.map(
        (permissionId) => ({
          permissionId,
          locationId: location.id,
          warehouseId: warehouse.id ?? '',
          roleId: role.id ?? '',
          comment: rolePermissionsDto.comment,
        }),
      );
      console.log(permsRoleModel);
      await this.prisma.permission_role.createMany({
        data: permsRoleModel,
        skipDuplicates: true,
      });
    }
  }

  async deleteRolePermissions(id: string) {}

  private async rewritePermsData(
    roleId: string,
    locationId: string,
    warehouseId: string,
  ) {
    const existingRolePerms = await this.prisma.permission_role.findMany({
      where: {
        roleId: roleId,
        locationId: locationId,
        warehouseId: warehouseId,
      },
    });

  }
}
