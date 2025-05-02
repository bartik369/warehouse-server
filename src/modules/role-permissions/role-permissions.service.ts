import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  AllRolesPermissionsResDto,
  RolePermissionsDto,
  RolePermissionsResponseDto,
} from './dtos/role-permissions.dto';

@Injectable()
export class RolePermissionsService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getAllRolesPermissions(): Promise<AllRolesPermissionsResDto[]> {
    const listPermissions = await this.prisma.permission_role.findMany({});
    const groupedByRole = listPermissions.reduce(
      (acc, elem) => {
        const { permissionId, ...rest } = elem;
        if (!acc[elem.roleId]) {
          acc[elem.roleId] = { ...rest, permissionId: [permissionId] };
        } else {
          acc[elem.roleId].permissionId.push(permissionId);
        }
        return acc;
      },
      {} as Record<string, Partial<RolePermissionsResponseDto>>,
    );
    const result = Object.values(groupedByRole);
    return await Promise.all(
      result.map(async (item) => {
        const [roleName, locationName, warehouseName, permissionNames] =
          await Promise.all([
            this.prisma.role.findUnique({
              where: { id: item.roleId },
            }),
            this.prisma.location.findUnique({
              where: { id: item.locationId },
            }),
            this.prisma.warehouse.findUnique({
              where: { id: item.warehouseId },
            }),
            this.prisma.permission.findMany({
              where: {
                id: { in: item.permissionId },
              },
              select: { name: true },
            }),
          ]);
        return {
          roleId: roleName.id ?? null,
          role: roleName?.name ?? null,
          location: locationName?.name ?? null,
          warehouse: warehouseName?.name ?? null,
          permissions: permissionNames.map((item) => item.name),
        };
      }),
    );
  }
  async getRolePermissions() {}
  // Create
  async createRolePermissions(rolePermissionsDto: RolePermissionsDto) {
    const existingRolePermissions = await this.prisma.permission_role.findMany({
      where: { roleId: rolePermissionsDto.roleId },
    });
    if (existingRolePermissions) {
      await this.prisma.permission_role.deleteMany({
        where: { roleId: rolePermissionsDto.roleId },
      });
    }
    const permissionRoleModel = rolePermissionsDto.permissionId.map(
      (permissionId) => ({
        permissionId,
        roleId: rolePermissionsDto.roleId?.trim(),
        locationId: rolePermissionsDto.locationId?.trim(),
        warehouseId: rolePermissionsDto.warehouseId?.trim(),
        comment: rolePermissionsDto.comment,
      }),
    );
    await this.prisma.permission_role.createMany({
      data: permissionRoleModel,
      skipDuplicates: true,
    });
  }
  // Permissions by role
  async getPermissionsByRole(id: string) {
    const existingRolePermissions = await this.prisma.permission_role.findMany({
      where: { roleId: id.trim() },
    });
    if (existingRolePermissions.length === 0)
      return new RolePermissionsResponseDto({ roleId: id.trim() });

    const rolePermissions = existingRolePermissions.reduce(
      (acc, elem) => {
        const { permissionId, ...rest } = elem;

        if (!acc[rest.roleId]) {
          acc[rest.roleId] = { ...rest, permissionId: [] };
        }
        acc[rest.roleId].permissionId.push(permissionId);
        return acc;
      },
      {} as Record<string, Partial<RolePermissionsResponseDto>>,
    );

    const permissionData = Object.values(rolePermissions)[0];

    const [existingLocation, existingWarehouse] = await Promise.all([
      this.prisma.location.findUnique({
        where: { id: permissionData.locationId?.trim() },
      }),
      this.prisma.warehouse.findUnique({
        where: { id: permissionData.warehouseId?.trim() },
      }),
    ]);
    const permissionsName = await this.prisma.permission.findMany({
      where: {
        id: { in: permissionData.permissionId },
      },
      select: { name: true },
    });
    const rolesName = permissionsName.map((item) => item.name);
    const res = {
      ...permissionData,
      locationName: existingLocation.name ?? '',
      warehouseName: existingWarehouse.name ?? '',
      permissionName: rolesName,
    };

    return res;
  }
  async updateRolePermissions(
    id: string,
    rolePermissionsDto: RolePermissionsDto,
  ) {
    const existRolePermissions = await this.prisma.permission_role.findMany({});
  }
  async deleteRolePermissions(id: string) {}
}
