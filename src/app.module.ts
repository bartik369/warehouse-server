import { PrismaService } from './../prisma/prisma.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ValidateAccessMIddleware } from './auth/middlewares/validate.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './guards';
import { APP_GUARD } from '@nestjs/core'
import { RequestMethod } from '@nestjs/common';

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
  },
  JwtService,
  UsersService,
  PrismaService
]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(ValidateAccessMIddleware)
      .exclude('auth/(.*)')
      .forRoutes({
        path: '*', method: RequestMethod.ALL
      })
  }
}
// export class AppModule {}
