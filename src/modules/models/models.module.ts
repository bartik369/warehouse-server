import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

@Module({
  imports: [PrismaModule],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}
