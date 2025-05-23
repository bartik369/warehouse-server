"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let RolePermissionsService = class RolePermissionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllRolesPermissions() {
        const listPermissions = await this.prisma.permission_role.findMany({});
        if (listPermissions.length === 0)
            throw new common_1.NotFoundException();
        const groupedByRole = listPermissions.reduce((acc, elem) => {
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
            }
            else if (permissionId) {
                acc[key].permissionIds.push(permissionId);
            }
            return acc;
        }, {});
        const groupedArray = Object.values(groupedByRole);
        const uniqueRoleIds = [
            ...new Set(groupedArray.map((r) => r.roleId)),
        ];
        const uniqueWarehouseIds = [
            ...new Set(groupedArray
                .map((w) => w.warehouseId)
                .filter(Boolean)),
        ];
        const uniqueLocationIds = [
            ...new Set(groupedArray
                .map((l) => l.locationId)
                .filter(Boolean)),
        ];
        const uniquePermissionIds = [
            ...new Set(groupedArray
                .flatMap((p) => p.permissionIds)
                .filter(Boolean)),
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
            throw new common_1.NotFoundException('Required roles or locations not found');
        }
        const roleMap = new Map(roles.map((r) => [r.id, r]));
        const warehouseMap = new Map(warehouses.map((w) => [w.id, w]));
        const locationMap = new Map(locations.map((l) => [l.id, l]));
        const permissionsMap = new Map(permissions.map((p) => [p.id, p]));
        return groupedArray.map(({ roleId, warehouseId, locationId, permissionIds }) => ({
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
            permissionName: permissionIds.length > 0
                ? permissionIds
                    .map((id) => permissionsMap.get(id)?.name)
                    .filter(Boolean)
                : [],
            permissionIds: permissionIds.length > 0
                ? permissionIds
                    .map((id) => permissionsMap.get(id)?.id)
                    .filter(Boolean)
                : [],
        }));
    }
    async createUpdateRolePermissions(rolePermissionsDto) {
        const { locationId, oldLocationId, warehouseId, oldWarehouseId, permissionIds, roleId, roleName, comment, } = rolePermissionsDto;
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
            }
            else {
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
        }
        else {
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
};
exports.RolePermissionsService = RolePermissionsService;
exports.RolePermissionsService = RolePermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolePermissionsService);
//# sourceMappingURL=role-permissions.service.js.map