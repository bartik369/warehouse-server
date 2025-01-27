import { join } from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from './modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Module} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DevicesModule } from './modules/devices/devices.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './modules/auth/guards';
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads', 'models'),
      serveRoot: '/api/models',
    }),
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
],
})

export class AppModule {}
