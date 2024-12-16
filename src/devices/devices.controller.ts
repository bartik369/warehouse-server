import { DeviceDto } from './dto/device.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, HttpStatus, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}
  @Get()
  async findAll() {
    return this.devicesService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.devicesService.findOne(id);
  // }

  // @Post('create')
  // @HttpCode(HttpStatus.CREATED)
  // async create(@Body() deviceDto: DeviceDto) {
  //   return this.devicesService.create(deviceDto);
  // }

  // @Get(':id')
  // async getDevice(
  //   @Param('id') id:string) {
  //     return this.devicesService.getDevice(id)
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
