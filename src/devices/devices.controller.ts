import { DeviceDto } from './dto/device.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  // @Get()
  // async findAll() {
  //   return this.devicesService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.devicesService.findOne(id);
  // }

  // @Post('new')
  // async create(@Body() deviceDto: DeviceDto) {
  //   return this.devicesService.create(deviceDto);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() deviceDto: DeviceDto) {
  //   return this.devicesService.update(id, deviceDto)
  // }

  // @Delete(':id')
  // async delete (@Param('id') id: string) {
  //   return this.devicesService.remove(id);
  // }
}
