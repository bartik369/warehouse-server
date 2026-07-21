import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  PermissionNotFoundException,
  RoleExistException,
  RoleNotFoundException,
} from 'src/exceptions/permissions.exceptions';
import { NotFoundUserException } from 'src/exceptions/user.exceptions';
import { CreateRoleDto } from './dto/create-role.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { RoleBaseDto } from './dto/role-base.dto';
import { RolesListResponseDto } from './dto/roles-list-res.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(): Promise<RoleBaseDto[]> {
    return this.prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getRole(id: string): Promise<RoleBaseDto> {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      throw new RoleNotFoundException();
    }

    return role;
  }

  async getAssignableRoles(): Promise<RoleBaseDto[]> {
    return this.prisma.role.findMany({
      where: {
        name: {
          not: 'administrator',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async createRole(roleDto: CreateRoleDto): Promise<RoleBaseDto> {
    const name = roleDto.name.trim();

    const existingRole = await this.prisma.role.findUnique({
      where: {
        name,
      },
    });

    if (existingRole) {
      throw new RoleExistException();
    }

    return this.prisma.role.create({
      data: {
        name,
        comment: roleDto.comment?.trim() || null,
      },
    });
  }

  async updateRole(id: string, roleDto: UpdateRoleDto): Promise<RoleBaseDto> {
    const existingRole = await this.prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!existingRole) {
      throw new RoleNotFoundException();
    }

    const name = roleDto.name?.trim();

    if (name && name !== existingRole.name) {
      const roleWithSameName = await this.prisma.role.findUnique({
        where: {
          name,
        },
      });

      if (roleWithSameName && roleWithSameName.id !== id) {
        throw new RoleExistException();
      }
    }

    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        name,
        comment: roleDto.comment !== undefined ? roleDto.comment.trim() || null : undefined,
      },
    });
  }

  async deleteRole(id: string): Promise<{ message: string }> {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      throw new RoleNotFoundException();
    }

    await this.prisma.role.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Роль удалена',
    };
  }

  async getRolesList() {
    const permissionRoles = await this.prisma.permission_role.findMany({
      where: {
        permissionId: {
          not: null,
        },
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        permission: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            locationId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    type RoleListItem = {
      roleId: string;
      roleName: string;

      locationId: string | null;
      locationName: string | null;

      warehouseId: string | null;
      warehouseName: string | null;

      permissionIds: Set<string>;
      permissionsName: Set<string>;
    };

    const rolesMap = new Map<string, RoleListItem>();

    for (const item of permissionRoles) {
      const key = this.createRoleScopeKey(item.roleId, item.locationId, item.warehouseId);

      if (!rolesMap.has(key)) {
        rolesMap.set(key, {
          roleId: item.role.id,
          roleName: item.role.name,

          locationId: item.location?.id ?? null,
          locationName: item.location?.name ?? null,

          warehouseId: item.warehouse?.id ?? null,
          warehouseName: item.warehouse?.name ?? null,

          permissionIds: new Set<string>(),
          permissionsName: new Set<string>(),
        });
      }

      const groupedRole = rolesMap.get(key);

      if (!groupedRole || !item.permission) {
        continue;
      }

      groupedRole.permissionIds.add(item.permission.id);
      groupedRole.permissionsName.add(item.permission.name);
    }

    return Array.from(rolesMap.values()).map((item) => ({
      roleId: item.roleId,
      roleName: item.roleName,

      locationId: item.locationId,
      locationName: item.locationName,

      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName,

      permissionIds: Array.from(item.permissionIds),
      permissionsName: Array.from(item.permissionsName),
    }));
  }

  async grantUserRole(userInfo: GrantRoleDto) {
    const userId = userInfo.userId.trim();
    const roleId = userInfo.roleId.trim();
    const locationId = userInfo.locationId?.trim() || null;
    const warehouseId = userInfo.warehouseId?.trim() || null;

    return this.prisma.$transaction(async (tx) => {
      const [user, role, location, warehouse] = await Promise.all([
        tx.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            userName: true,
            email: true,
            isActive: true,
          },
        }),

        tx.role.findUnique({
          where: {
            id: roleId,
          },
          select: {
            id: true,
            name: true,
          },
        }),

        locationId
          ? tx.location.findUnique({
              where: {
                id: locationId,
              },
              select: {
                id: true,
                name: true,
              },
            })
          : Promise.resolve(null),

        warehouseId
          ? tx.warehouse.findUnique({
              where: {
                id: warehouseId,
              },
              select: {
                id: true,
                name: true,
                locationId: true,
              },
            })
          : Promise.resolve(null),
      ]);

      if (!user) {
        throw new NotFoundUserException();
      }

      if (!user.isActive) {
        throw new BadRequestException('Нельзя назначить роль неактивному пользователю');
      }

      if (!role) {
        throw new RoleNotFoundException();
      }

      if (locationId && !location) {
        throw new NotFoundException('Локация не найдена');
      }

      if (warehouseId && !warehouse) {
        throw new NotFoundException('Склад не найден');
      }

      if (warehouse && locationId && warehouse.locationId !== locationId) {
        throw new BadRequestException('Выбранный склад не относится к выбранной локации');
      }
      const resolvedLocationId = warehouse?.locationId ?? locationId;

      if (!resolvedLocationId) {
        throw new BadRequestException('Необходимо указать locationId или warehouseId');
      }

      const permissionRoles = await tx.permission_role.findMany({
        where: {
          roleId,
          locationId: resolvedLocationId,
          warehouseId,
          permissionId: {
            not: null,
          },
        },
        include: {
          permission: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (permissionRoles.length === 0) {
        throw new PermissionNotFoundException();
      }

      const existingUserRole = await tx.user_role.findFirst({
        where: {
          userId,
          roleId,
          locationId: resolvedLocationId,
          warehouseId,
        },
        select: {
          id: true,
        },
      });

      if (existingUserRole) {
        throw new ConflictException('Эта роль уже назначена пользователю');
      }

      const userRole = await tx.user_role.create({
        data: {
          userId,
          roleId,
          locationId: resolvedLocationId,
          warehouseId,
        },
      });

      return {
        message: 'Доступ предоставлен',
        assignment: {
          id: userRole.id,

          userId: user.id,
          userName: user.userName,
          email: user.email,

          roleId: role.id,
          roleName: role.name,

          locationId: resolvedLocationId,
          locationName:
            location?.name ??
            (warehouse
              ? ((
                  await tx.location.findUnique({
                    where: {
                      id: resolvedLocationId,
                    },
                    select: {
                      name: true,
                    },
                  })
                )?.name ?? null)
              : null),

          warehouseId: warehouse?.id ?? null,
          warehouseName: warehouse?.name ?? null,

          permissions: permissionRoles
            .map((item) => item.permission)
            .filter(
              (
                permission,
              ): permission is {
                id: string;
                name: string;
              } => permission !== null,
            ),
        },
      };
    });
  }

  async getUserRoles(id: string): Promise<RolesListResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existingUser) {
      throw new NotFoundUserException();
    }

    const userRolesData = await this.prisma.user_role.findMany({
      where: {
        userId: id,
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (userRolesData.length === 0) {
      const { location, department, ...userData } = existingUser;

      return {
        user: {
          ...userData,
          location: location.name,
          department: department?.name ?? null,
        },
        roles: [],
      };
    }

    const rolePermissionScopes = userRolesData.map((userRole) => ({
      roleId: userRole.roleId,
      locationId: userRole.locationId,
      warehouseId: userRole.warehouseId,
    }));

    const permissionRoles = await this.prisma.permission_role.findMany({
      where: {
        permissionId: {
          not: null,
        },
        OR: rolePermissionScopes,
      },
      include: {
        permission: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    type PermissionInfo = {
      id: string;
      name: string;
    };

    const permissionsMap = new Map<string, PermissionInfo[]>();

    for (const item of permissionRoles) {
      if (!item.permission) {
        continue;
      }

      const key = this.createRoleScopeKey(item.roleId, item.locationId, item.warehouseId);

      const permissions = permissionsMap.get(key) ?? [];

      permissions.push({
        id: item.permission.id,
        name: item.permission.name,
      });

      permissionsMap.set(key, permissions);
    }

    const groupedRolesData = userRolesData.map((userRole) => {
      const key = this.createRoleScopeKey(
        userRole.roleId,
        userRole.locationId,
        userRole.warehouseId,
      );

      const permissions = permissionsMap.get(key) ?? [];

      return {
        assignmentId: userRole.id,

        roleId: userRole.role.id,
        roleName: userRole.role.name,

        locationId: userRole.location?.id ?? null,
        locationName: userRole.location?.name ?? null,

        warehouseId: userRole.warehouse?.id ?? null,
        warehouseName: userRole.warehouse?.name ?? null,

        permissionIds: permissions.map((permission) => permission.id),

        permissionsName: permissions.map((permission) => permission.name),
      };
    });

    const { location, department, ...userData } = existingUser;

    return {
      user: {
        ...userData,
        location: location.name,
        department: department?.name ?? null,
      },
      roles: groupedRolesData,
    };
  }

  private createRoleScopeKey(
    roleId: string,
    locationId: string | null,
    warehouseId: string | null,
  ): string {
    return [roleId, locationId ?? 'null', warehouseId ?? 'null'].join('::');
  }
}
