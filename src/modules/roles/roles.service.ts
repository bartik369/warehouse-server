import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RoleExistException, RoleNotFoundException } from 'src/exceptions/permissions.exceptions';
import { NotFoundUserException } from 'src/exceptions/user.exceptions';
import { CreateRoleDto } from './dto/create-role.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { RoleBaseDto } from './dto/role-base.dto';
import { RolesListResponseDto } from './dto/roles-list-res.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionInfo, RoleListItem } from './types/role.types';

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

  async revokeUserRole(assignmentId: string) {
    const assignment = await this.prisma.user_role.findUnique({
      where: {
        id: assignmentId,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Назначение роли не найдено');
    }

    await this.prisma.user_role.delete({
      where: {
        id: assignmentId,
      },
    });

    return {
      message: 'Роль пользователя удалена',
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
  async grantUserRoles(userInfo: GrantRoleDto) {
    const { userId, roles } = userInfo;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          userName: true,
          email: true,
          firstNameRu: true,
          lastNameRu: true,
          isActive: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      if (!user.isActive) {
        throw new BadRequestException('Нельзя назначить роль неактивному пользователю');
      }

      const assignments: Array<{
        id: string;
        roleId: string;
        roleName: string;
        locationId: string;
        locationName: string;
        warehouseId: string | null;
        warehouseName: string | null;
        permissions: Array<{
          id: string;
          name: string;
        }>;
      }> = [];

      const skippedAssignments: Array<{
        id: string;
        roleId: string;
        roleName: string;
        locationId: string;
        locationName: string;
        warehouseId: string | null;
        warehouseName: string | null;
      }> = [];

      const processedAssignments = new Set<string>();

      for (const roleItem of roles) {
        const roleId = roleItem.roleId;
        const locationId = roleItem.locationId;
        const warehouseId = roleItem.warehouseId ?? null;
        const assignmentKey = [roleId, locationId, warehouseId ?? 'without-warehouse'].join('::');

        if (processedAssignments.has(assignmentKey)) {
          continue;
        }

        processedAssignments.add(assignmentKey);

        const [role, location, warehouse] = await Promise.all([
          tx.role.findUnique({
            where: {
              id: roleId,
            },
            select: {
              id: true,
              name: true,
            },
          }),

          tx.location.findUnique({
            where: {
              id: locationId,
            },
            select: {
              id: true,
              name: true,
            },
          }),

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

        if (!role) {
          throw new NotFoundException(`Роль с идентификатором "${roleId}" не найдена`);
        }

        if (!location) {
          throw new NotFoundException(`Локация с идентификатором "${locationId}" не найдена`);
        }

        if (warehouseId && !warehouse) {
          throw new NotFoundException(`Склад с идентификатором "${warehouseId}" не найден`);
        }

        if (warehouse && warehouse.locationId !== locationId) {
          throw new BadRequestException(
            `Склад "${warehouse.name}" не относится к локации "${location.name}"`,
          );
        }

        const existingUserRole = await tx.user_role.findFirst({
          where: {
            userId,
            roleId,
            locationId,
            warehouseId,
          },
          select: {
            id: true,
          },
        });

        if (existingUserRole) {
          skippedAssignments.push({
            id: existingUserRole.id,
            roleId: role.id,
            roleName: role.name,
            locationId: location.id,
            locationName: location.name,
            warehouseId: warehouse?.id ?? null,
            warehouseName: warehouse?.name ?? null,
          });

          continue;
        }

        const createdUserRole = await tx.user_role.create({
          data: {
            userId,
            roleId,
            locationId,
            warehouseId,
          },
          select: {
            id: true,
          },
        });

        const permissionRoles = await tx.permission_role.findMany({
          where: {
            roleId,
            locationId,
            warehouseId,
            permissionId: {
              not: null,
            },
          },
          select: {
            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        const permissions = permissionRoles
          .map((item) => item.permission)
          .filter(
            (
              permission,
            ): permission is {
              id: string;
              name: string;
            } => permission !== null,
          );

        assignments.push({
          id: createdUserRole.id,
          roleId: role.id,
          roleName: role.name,
          locationId: location.id,
          locationName: location.name,
          warehouseId: warehouse?.id ?? null,
          warehouseName: warehouse?.name ?? null,
          permissions,
        });
      }

      let message: string;

      if (assignments.length > 0 && skippedAssignments.length > 0) {
        message =
          `Добавлено ролей: ${assignments.length}. ` +
          `Уже было назначено: ${skippedAssignments.length}`;
      } else if (assignments.length > 0) {
        message = `Добавлено ролей: ${assignments.length}`;
      } else {
        message = 'Все выбранные роли уже назначены пользователю';
      }

      return {
        message,

        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          firstNameRu: user.firstNameRu,
          lastNameRu: user.lastNameRu,
        },

        assignments,
        skippedAssignments,
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
