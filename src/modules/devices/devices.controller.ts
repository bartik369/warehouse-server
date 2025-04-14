import { DeviceDto } from './dtos/device.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  IAggregatedDeviceInfo,
  IDeviceOptions,
  IFilteredDevices,
} from 'src/common/types/device.types';
import { DevicesService } from './devices.service';
import { deviceCreated, deviceUpdated } from 'src/common/utils/constants';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDevice(
    @Body() deviceDto: DeviceDto,
  ): Promise<{ message: string; device: Partial<DeviceDto> }> {
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
  ): Promise<{ devices: IFilteredDevices[]; totalPages: number }> {
    const result = await this.devicesService.findAll(query, city);
    const { devices, totalPages } = result;
    return { devices, totalPages };
  }

  @Get('/options/:city')
  async getOptions(@Param('city') city: string): Promise<IDeviceOptions> {
    return await this.devicesService.getOptions(city);
  }

  @Get(':id')
  async getDevice(@Param('id') id: string): Promise<IAggregatedDeviceInfo> {
    return await this.devicesService.getDevice(id);
  }
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateDevice(
    @Param('id') id: string,
    @Body() deviceDto: DeviceDto,
  ): Promise<{ message: string; updatedDevice: DeviceDto }> {
    const updatedDevice = await this.devicesService.updateDevice(id, deviceDto);
    return {
      message: deviceUpdated,
      updatedDevice,
    };
  }
}
