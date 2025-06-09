import { PermissionNotFoundException } from './../../exceptions/permissions.exceptions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  RoleExistException,
  RoleNotFoundException,
} from 'src/exceptions/permissions.exceptions';
import { RoleBaseDto } from './dto/role-base.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { NotFoundUserException } from 'src/exceptions/user.exceptions';
import { RolesListResponseDto } from './dto/roles-list-res.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getRoles(): Promise<RoleBaseDto[]> {
    const roles = await this.prisma.role.findMany({});
    if (!roles) throw new RoleNotFoundException();
    return roles;
  }
  // Get by ID
  async getRole(id: string): Promise<RoleBaseDto> {
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!role) throw new RoleNotFoundException();
    return role;
  }
  // Get all for Assign
  async getAssignableRoles(): Promise<RoleBaseDto[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        name: { not: 'administrator' },
      },
    });
    return roles;
  }
  // Create
  async createRole(roleDto: CreateRoleDto): Promise<RoleBaseDto> {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: roleDto.name?.trim() },
    });
    if (existingRole) throw new RoleExistException();
    const role = await this.prisma.role.create({
      data: {
        name: roleDto.name,
        comment: roleDto.comment,
      },
    });
    return role;
  }
  // Update
  async updateRole(id: string, roleDto: UpdateRoleDto): Promise<RoleBaseDto> {
    const existingRole = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!existingRole) throw new RoleNotFoundException();
    const updatedRole = await this.prisma.role.update({
      where: { id: id },
      data: {
        name: roleDto.name,
        comment: roleDto.comment,
      },
    });
    return updatedRole;
  }
  // Delete
  async deleteRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!role) throw new RoleNotFoundException();
    await this.prisma.role.delete({
      where: { id: id },
    });
  }
  async getRolesList() {
    const permissionRoles = await this.prisma.permission_role.findMany({
      include: {
        role: true,
        permission: true,
        location: true,
        warehouse: true,
      },
    });
    const map = new Map();
    for (const item of permissionRoles) {
      const key = `${item.roleId}/${item.locationId}/${item.warehouseId || 'null'}`;
      if (!map.has(key)) {
        map.set(key, {
          roleName: item.role.name,
          locationName: item.location?.name || '',
          warehouseName: item.warehouse?.name || '',
        });
      }
    }
    return Array.from(map, ([roleId, data]) => ({
      roleId,
      ...data,
    }));
  }
  async grantUserRole(userInfo: GrantRoleDto) {
    const [user, role, location, warehouse] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userInfo.userId },
      }),
      this.prisma.role.findUnique({
        where: { id: userInfo.roleId },
      }),
      this.prisma.location.findUnique({
        where: { id: userInfo.locationId },
      }),
      userInfo.warehouseId
        ? this.prisma.warehouse.findUnique({
            where: { id: userInfo.warehouseId },
          })
        : Promise.resolve(null),
    ]);
    if (!user || !role || !location) {
      throw new NotFoundException();
    }
    if (userInfo.warehouseId && !warehouse) {
      throw new NotFoundException();
    }
    const permissionsRole = await this.prisma.permission_role.findMany({
      where: {
        roleId: userInfo.roleId,
        locationId: userInfo.locationId,
        warehouseId: userInfo.warehouseId ?? null,
      },
    });
    if (!permissionsRole.length) throw new PermissionNotFoundException();

    const permissionsRolesList = permissionsRole.map((role) => ({
      userId: userInfo.userId,
      roleId: role.roleId,
      permissionRoleId: role.id,
    }));
    await this.prisma.user_role.createMany({
      data: permissionsRolesList,
      skipDuplicates: true,
    });
    return { message: 'Доступ предоставлен' };
  }

  async getUserRoles(id: string): Promise<RolesListResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        location: {
          select: { name: true },
        },
        department: {
          select: { name: true },
        },
      },
    });
    if (!existingUser) throw new NotFoundUserException();

    const userRolesData = await this.prisma.user_role.findMany({
      where: {
        userId: id,
        permissionRole: {
          permissionId: { not: null },
        },
      },
      include: {
        permissionRole: {
          select: {
            location: {
              select: { name: true },
            },
            warehouse: {
              select: { name: true },
            },
            permission: {
              select: { name: true },
            },
            role: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    const map = new Map();
    for (const elem of userRolesData) {
      const location = elem.permissionRole.location?.name;
      const warehouse = elem.permissionRole.warehouse?.name || null;
      const permission = elem.permissionRole.permission?.name;
      const roleId = elem.permissionRole.role.id;
      const role = elem.permissionRole.role.name;
      const key = `${warehouse}::${location}`;

      if (!map.has(key)) {
        map.set(key, {
          locationName: location,
          warehouseName: warehouse,
          roleName: role,
          roleId: roleId,
          permissionsName: new Set(),
        });
      }
      map.get(key).permissionsName.add(permission);
    }
    const groupedRolesData = Array.from(map.values()).map((item) => ({
      locationName: item.locationName,
      warehouseName: item.warehouseName,
      roleName: item.roleName,
      roleId: item.roleId,
      permissionsName: [...item.permissionsName],
    }));

    const { location, department, ...rest } = existingUser;
    return {
      user: {
        ...rest,
        location: location.name,
        department: department.name,
      },
      roles: groupedRolesData,
    };
  }
}
