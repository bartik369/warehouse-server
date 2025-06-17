import { DeviceBaseDto } from './dtos/device-base.dto';
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
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDevice(
    @Body() deviceDto: CreateDeviceDto,
  ): Promise<{ message: string; device: Partial<DeviceBaseDto> }> {
    const device = await this.devicesService.createDevice(deviceDto);
    return {
      message: deviceCreated,
      device,
    };
  }
  @Get('search')
  async searchDevices(@Query('q') q: string): Promise<DeviceBaseDto[]> {
    return await this.devicesService.searchDevices(q);
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
    @Body() deviceDto: UpdateDeviceDto,
  ): Promise<{ message: string; updatedDevice: DeviceBaseDto }> {
    const updatedDevice = await this.devicesService.updateDevice(id, deviceDto);
    return {
      message: deviceUpdated,
      updatedDevice,
    };
  }
}
