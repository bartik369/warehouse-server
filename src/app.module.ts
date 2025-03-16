import { WarehousesModule } from './modules/warehouse/warehouses.module';
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
