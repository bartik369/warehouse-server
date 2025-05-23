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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const permissions_exceptions_1 = require("../../exceptions/permissions.exceptions");
let PermissionsService = class PermissionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPermissions() {
        const permissions = await this.prisma.permission.findMany({});
        if (!permissions)
            return null;
        return permissions;
    }
    async getPermission(id) {
        const permission = await this.prisma.permission.findUnique({
            where: { id: id },
        });
        if (!permission)
            throw new permissions_exceptions_1.PermissionNotFoundException();
        return permission;
    }
    async createPermission(permissionDto) {
        const existingPermission = await this.prisma.permission.findUnique({
            where: { name: permissionDto.name?.trim() },
        });
        if (existingPermission)
            throw new permissions_exceptions_1.PermissionExistException();
        const permission = await this.prisma.permission.create({
            data: {
                name: permissionDto.name?.trim(),
                comment: permissionDto.comment,
            },
        });
        return permission;
    }
    async updatePermission(id, permissionDto) {
        const existingPermission = await this.prisma.permission.findUnique({
            where: { id: id },
        });
        if (!existingPermission)
            throw new permissions_exceptions_1.PermissionNotFoundException();
        const updatedPermission = await this.prisma.permission.update({
            where: { id: id },
            data: {
                name: permissionDto.name?.trim(),
                comment: permissionDto.comment || undefined,
            },
        });
        return updatedPermission;
    }
    async deletePermission(id) {
        const permission = await this.prisma.permission.findUnique({
            where: { id: id },
        });
        if (!permission)
            throw new permissions_exceptions_1.PermissionNotFoundException();
        await this.prisma.permission.delete({
            where: { id: id },
        });
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map