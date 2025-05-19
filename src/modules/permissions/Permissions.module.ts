import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
console.log('dsd')
@Module({
  imports: [PrismaModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
