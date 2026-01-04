import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PrismaModule } from 'prisma/prisma.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [PrismaModule, NestjsFormDataModule],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
