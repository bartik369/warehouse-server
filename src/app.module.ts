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

console.log(
  'Static files rootPath:',
  join(__dirname, '..', 'uploads', 'models'),
);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'models'),
      serveRoot: '/api/models/',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
