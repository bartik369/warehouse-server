import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.register({
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtService, 
    AccessTokenStrategy, 
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
