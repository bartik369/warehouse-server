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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionsController = void 0;
const common_1 = require("@nestjs/common");
const role_permissions_service_1 = require("./role-permissions.service");
const role_permissions_dto_1 = require("./dtos/role-permissions.dto");
let RolePermissionsController = class RolePermissionsController {
    constructor(rolePermissionsService) {
        this.rolePermissionsService = rolePermissionsService;
    }
    async getRolePermissions() {
        return await this.rolePermissionsService.getAllRolesPermissions();
    }
    async createRolePermissions(rolePermissionsDto) {
        await this.rolePermissionsService.createUpdateRolePermissions(rolePermissionsDto);
        return {
            message: 'ew',
        };
    }
    async updateRolePermissions(rolePermissionsDto) {
        await this.rolePermissionsService.createUpdateRolePermissions(rolePermissionsDto);
        return {
            message: 'ew',
        };
    }
};
exports.RolePermissionsController = RolePermissionsController;
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_permissions_dto_1.RolePermissionsDto]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "createRolePermissions", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [role_permissions_dto_1.RolePermissionsDto]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "updateRolePermissions", null);
exports.RolePermissionsController = RolePermissionsController = __decorate([
    (0, common_1.Controller)('permissions-roles'),
    __metadata("design:paramtypes", [role_permissions_service_1.RolePermissionsService])
], RolePermissionsController);
//# sourceMappingURL=role-permissions.controller.js.map