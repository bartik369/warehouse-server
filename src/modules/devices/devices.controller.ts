import { DeviceDto } from './dtos/device.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { deviceCreated } from 'src/common/utils/constants';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createDevice(@Body() deviceDto: DeviceDto) {
    console.log(deviceDto);
    const device = await this.devicesService.createDevice(deviceDto);
    return {
      message: deviceCreated,
      device,
    };
  }

  @Get('/locations/:city')
  async findAll(
    @Param('city') city: string,
    @Query() query: Record<string, string>,
  ) {
    return this.devicesService.findAll(query, city);
  }

  @Get('/options/:city')
  async getOptions(@Param('city') city: string) {
    return await this.devicesService.getOptions(city);
  }

  @Get(':id')
  async getDevice(@Param('id') id: string) {
    return await this.devicesService.getDevice(id);
  }
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateDevice(@Param('id') id: string, @Body() deviceDto: DeviceDto) {
    return await this.devicesService.updateDevice(id, deviceDto);
  }
}
