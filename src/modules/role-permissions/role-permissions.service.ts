import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRolePermissionsDto } from './dtos/create-role-permissions.dto';
import { RolePermissionsResponseDto } from './dtos/response-role-permissions.dto';
import { GroupedResponse } from './types';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRolesPermissions(): Promise<RolePermissionsResponseDto[]> {
    const permissionRoles = await this.prisma.permission_role.findMany({
      include: {
        role: {
          select: {
            id: true,
            name: true,
            comment: true,
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
        permission: {
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

    if (permissionRoles.length === 0) {
      throw new NotFoundException('Настройки прав ролей не найдены');
    }

    const groupedMap = new Map<string, GroupedResponse>();

    for (const item of permissionRoles) {
      const key = this.createScopeKey(item.roleId, item.locationId, item.warehouseId);

      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          roleId: item.role.id,
          roleName: item.role.name,
          comment: item.comment || null,
          locationId: item.location?.id ?? null,
          locationName: item.location?.name ?? null,
          warehouseId: item.warehouse?.id ?? null,
          warehouseName: item.warehouse?.name ?? null,
          permissionIds: new Set<string>(),
          permissionsName: new Set<string>(),
        });
      }

      const groupedItem = groupedMap.get(key);

      if (!groupedItem) {
        continue;
      }

      if (item.permission) {
        groupedItem.permissionIds.add(item.permission.id);
        groupedItem.permissionsName.add(item.permission.name);
      }
    }

    return Array.from(groupedMap.values()).map((item) => ({
      roleId: item.roleId,
      roleName: item.roleName,
      comment: item.comment,
      locationId: item.locationId,
      locationName: item.locationName,
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName,
      permissionIds: Array.from(item.permissionIds),
      permissionsName: Array.from(item.permissionsName),
    }));
  }

  async createUpdateRolePermissions(
    rolePermissionsDto: CreateRolePermissionsDto,
  ): Promise<{ message: string }> {
    const {
      roleId,
      permissionIds,
      locationId,
      warehouseId,
      oldLocationId,
      oldWarehouseId,
      comment,
    } = rolePermissionsDto;

    const normalizedRoleId = roleId.trim();
    const normalizedLocationId = locationId?.trim() || oldLocationId?.trim() || null;
    const normalizedWarehouseId = warehouseId?.trim() || oldWarehouseId?.trim() || null;
    const normalizedComment = comment?.trim() ?? '';
    const normalizedPermissionIds = [
      ...new Set(permissionIds.map((permissionId) => permissionId.trim()).filter(Boolean)),
    ];

    if (!normalizedLocationId) {
      throw new BadRequestException('Необходимо указать locationId');
    }

    return this.prisma.$transaction(async (tx) => {
      const [role, location, warehouse] = await Promise.all([
        tx.role.findUnique({
          where: {
            id: normalizedRoleId,
          },
          select: {
            id: true,
            name: true,
          },
        }),

        tx.location.findUnique({
          where: {
            id: normalizedLocationId,
          },
          select: {
            id: true,
            name: true,
          },
        }),

        normalizedWarehouseId
          ? tx.warehouse.findUnique({
              where: {
                id: normalizedWarehouseId,
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
        throw new NotFoundException('Роль не найдена');
      }

      if (!location) {
        throw new NotFoundException('Локация не найдена');
      }

      if (normalizedWarehouseId && !warehouse) {
        throw new NotFoundException('Склад не найден');
      }

      if (warehouse && warehouse.locationId !== normalizedLocationId) {
        throw new BadRequestException('Выбранный склад не относится к выбранной локации');
      }

      const permissions =
        normalizedPermissionIds.length > 0
          ? await tx.permission.findMany({
              where: {
                id: {
                  in: normalizedPermissionIds,
                },
              },
              select: {
                id: true,
              },
            })
          : [];

      if (permissions.length !== normalizedPermissionIds.length) {
        const existingPermissionIds = new Set(permissions.map((permission) => permission.id));

        const missingPermissionIds = normalizedPermissionIds.filter(
          (permissionId) => !existingPermissionIds.has(permissionId),
        );

        throw new NotFoundException(`Permissions не найдены: ${missingPermissionIds.join(', ')}`);
      }
      const previousLocationId = oldLocationId?.trim() || normalizedLocationId;
      const previousWarehouseId = oldWarehouseId?.trim() || null;
      const scopeWasChanged =
        previousLocationId !== normalizedLocationId ||
        previousWarehouseId !== normalizedWarehouseId;

      if (scopeWasChanged) {
        await tx.permission_role.deleteMany({
          where: {
            roleId: normalizedRoleId,
            locationId: previousLocationId,
            warehouseId: previousWarehouseId,
          },
        });
      }

      const existingPermissionRoles = await tx.permission_role.findMany({
        where: {
          roleId: normalizedRoleId,
          locationId: normalizedLocationId,
          warehouseId: normalizedWarehouseId,
        },
        select: {
          id: true,
          permissionId: true,
        },
      });

      const existingPermissionIds = new Set(
        existingPermissionRoles
          .map((item) => item.permissionId)
          .filter((permissionId): permissionId is string => permissionId !== null),
      );

      const requestedPermissionIds = new Set(normalizedPermissionIds);
      const permissionRoleIdsToDelete = existingPermissionRoles
        .filter(
          (item) => item.permissionId !== null && !requestedPermissionIds.has(item.permissionId),
        )
        .map((item) => item.id);

      if (permissionRoleIdsToDelete.length > 0) {
        await tx.permission_role.deleteMany({
          where: {
            id: {
              in: permissionRoleIdsToDelete,
            },
          },
        });
      }

      const permissionIdsToAdd = normalizedPermissionIds.filter(
        (permissionId) => !existingPermissionIds.has(permissionId),
      );

      if (permissionIdsToAdd.length > 0) {
        await tx.permission_role.createMany({
          data: permissionIdsToAdd.map((permissionId) => ({
            roleId: normalizedRoleId,
            permissionId,
            locationId: normalizedLocationId,
            warehouseId: normalizedWarehouseId,
            comment: normalizedComment,
          })),
          skipDuplicates: true,
        });
      }
      await tx.permission_role.updateMany({
        where: {
          roleId: normalizedRoleId,
          locationId: normalizedLocationId,
          warehouseId: normalizedWarehouseId,
        },
        data: {
          comment: normalizedComment,
        },
      });

      if (normalizedPermissionIds.length === 0) {
        const emptyPermissionRecord = await tx.permission_role.findFirst({
          where: {
            roleId: normalizedRoleId,
            locationId: normalizedLocationId,
            warehouseId: normalizedWarehouseId,
            permissionId: null,
          },
          select: {
            id: true,
          },
        });

        await tx.permission_role.deleteMany({
          where: {
            roleId: normalizedRoleId,
            locationId: normalizedLocationId,
            warehouseId: normalizedWarehouseId,
            permissionId: {
              not: null,
            },
          },
        });

        if (emptyPermissionRecord) {
          await tx.permission_role.update({
            where: {
              id: emptyPermissionRecord.id,
            },
            data: {
              comment: normalizedComment,
            },
          });
        } else {
          await tx.permission_role.create({
            data: {
              roleId: normalizedRoleId,
              permissionId: null,
              locationId: normalizedLocationId,
              warehouseId: normalizedWarehouseId,
              comment: normalizedComment,
            },
          });
        }
      } else {
        await tx.permission_role.deleteMany({
          where: {
            roleId: normalizedRoleId,
            locationId: normalizedLocationId,
            warehouseId: normalizedWarehouseId,
            permissionId: null,
          },
        });
      }

      return {
        message: 'Права роли успешно обновлены',
      };
    });
  }

  private createScopeKey(
    roleId: string,
    locationId: string | null,
    warehouseId: string | null,
  ): string {
    return [roleId, locationId ?? 'null', warehouseId ?? 'null'].join('::');
  }
}
