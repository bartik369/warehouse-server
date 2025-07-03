import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from './modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DevicesModule } from './modules/devices/devices.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './modules/auth/guards';
import { APP_GUARD } from '@nestjs/core';
import { ContractorsModule } from './modules/contactors/contrators.module';
import { LocationModule } from './modules/locations/locations.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { ManufacturersModule } from './modules/manufacturers/manufacturers.module';
import { TypesModule } from './modules/types/types.module';
import { ModelsModule } from './modules/models/models.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';
import { IssueModule } from './modules/issue/issue.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath:
        process.env.NODE_ENV === 'production'
          ? '/app/uploads/models'
          : join(__dirname, '..', '..', 'uploads', 'issue'),
      serveRoot: '/api/uploads/models/',
    }),
    ServeStaticModule.forRoot({
      rootPath:
        process.env.NODE_ENV === 'production'
          ? '/app/uploads/files/issue'
          : join(__dirname, '..', '..', 'uploads', 'issue'),
      serveRoot: '/api/files/issue/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? undefined
          : `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    DevicesModule,
    UsersModule,
    WarehousesModule,
    AuthModule,
    ContractorsModule,
    LocationModule,
    DepartmentsModule,
    ManufacturersModule,
    TypesModule,
    ModelsModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    IssueModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    JwtService,
    UsersService,
    PrismaService,
  ],
})
export class AppModule {}
