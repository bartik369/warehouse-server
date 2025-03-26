import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';

@Module({
  imports: [PrismaModule],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
