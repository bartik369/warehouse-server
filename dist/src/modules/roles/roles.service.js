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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const permissions_exceptions_1 = require("../../exceptions/permissions.exceptions");
let RolesService = class RolesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoles() {
        const roles = await this.prisma.role.findMany({});
        if (!roles)
            throw new permissions_exceptions_1.RoleNotFoundException();
        return roles;
    }
    async getRole(id) {
        const role = await this.prisma.role.findUnique({
            where: { id: id },
        });
        if (!role)
            throw new permissions_exceptions_1.RoleNotFoundException();
        return role;
    }
    async getAssignableRoles() {
        const roles = await this.prisma.role.findMany({
            where: {
                name: { not: 'administrator' },
            },
        });
        return roles;
    }
    async createRole(roleDto) {
        const existingRole = await this.prisma.role.findUnique({
            where: { name: roleDto.name?.trim() },
        });
        if (existingRole)
            throw new permissions_exceptions_1.RoleExistException();
        const role = await this.prisma.role.create({
            data: {
                name: roleDto.name?.trim(),
                comment: roleDto.comment,
            },
        });
        return role;
    }
    async updateRole(id, roleDto) {
        const existingRole = await this.prisma.role.findUnique({
            where: { id: id },
        });
        if (!existingRole)
            throw new permissions_exceptions_1.RoleNotFoundException();
        const updatedRole = await this.prisma.role.update({
            where: { id: id },
            data: {
                name: roleDto.name?.trim(),
                comment: roleDto.comment,
            },
        });
        return updatedRole;
    }
    async deleteRole(id) {
        const role = await this.prisma.role.findUnique({
            where: { id: id },
        });
        if (!role)
            throw new permissions_exceptions_1.RoleNotFoundException();
        await this.prisma.role.delete({
            where: { id: id },
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map