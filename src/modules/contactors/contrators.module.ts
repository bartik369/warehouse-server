import { ContractorsController } from './contractors.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ContractorsService } from './contractors.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [ContractorsController],
  providers: [ContractorsService],
})
export class ContractorsModule {}
