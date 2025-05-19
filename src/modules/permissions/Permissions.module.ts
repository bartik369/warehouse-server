import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './Permissions.service';

@Module({
  imports: [PrismaModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
