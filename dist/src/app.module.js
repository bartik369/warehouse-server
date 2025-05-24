"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const warehouses_module_1 = require("./modules/warehouses/warehouses.module");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("./modules/users/users.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const devices_module_1 = require("./modules/devices/devices.module");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const config_1 = require("@nestjs/config");
const guards_1 = require("./modules/auth/guards");
const core_1 = require("@nestjs/core");
const contrators_module_1 = require("./modules/contactors/contrators.module");
const locations_module_1 = require("./modules/locations/locations.module");
const departments_module_1 = require("./modules/departments/departments.module");
const manufacturers_module_1 = require("./modules/manufacturers/manufacturers.module");
const types_module_1 = require("./modules/types/types.module");
const models_module_1 = require("./modules/models/models.module");
const roles_module_1 = require("./modules/roles/roles.module");
const permissions_module_1 = require("./modules/permissions/permissions.module");
const role_permissions_module_1 = require("./modules/role-permissions/role-permissions.module");
console.log('Static files rootPath:', (0, path_1.join)(__dirname, '..', 'uploads', 'models'));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'uploads', 'models'),
                serveRoot: '/api/models/',
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'production'
                    ? undefined
                    : `.env.${process.env.NODE_ENV || 'development'}`,
            }),
            devices_module_1.DevicesModule,
            users_module_1.UsersModule,
            warehouses_module_1.WarehousesModule,
            auth_module_1.AuthModule,
            contrators_module_1.ContractorsModule,
            locations_module_1.LocationModule,
            departments_module_1.DepartmentsModule,
            manufacturers_module_1.ManufacturersModule,
            types_module_1.TypesModule,
            models_module_1.ModelsModule,
            roles_module_1.RolesModule,
            permissions_module_1.PermissionsModule,
            role_permissions_module_1.RolePermissionsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: guards_1.AccessTokenGuard,
            },
            jwt_1.JwtService,
            users_service_1.UsersService,
            prisma_service_1.PrismaService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map