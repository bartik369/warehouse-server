import { DevicesController } from './devices.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { DevicesService } from './devices.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
