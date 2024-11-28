import { Module } from '@nestjs/common';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DevicesModule, 
    UsersModule, 
    AuthModule
  ],
})
export class AppModule {}
