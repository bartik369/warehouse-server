import { Module } from '@nestjs/common';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './guards';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DevicesModule, 
    UsersModule, 
    AuthModule,
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AccessTokenGuard,
  }]
})
export class AppModule {}
