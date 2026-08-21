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
import { deviceCreated, deviceUpdated } from 'src/common/utils/constants';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { DeviceBaseDto } from './dtos/device-base.dto';
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
  @Get(':processId/devices')
  async getIssueDevices(@Param('processId') processId: string) {
    return await this.devicesService.getIssueDevices(processId);
  }

  @Get('search')
  searchDevices(@Query('q') q: string, @Query('warehouseId') warehouseId: string) {
    return this.devicesService.searchDevices(q, warehouseId);
  }

  @Get('assigned/user/:userId')
  async getAssignedDevicesByUser(@Param('userId') userId: string) {
    return this.devicesService.getAssignedDevicesByUser(userId);
  }

  @Get('/locations/:city')
  async findAll(
    @Param('city') city: string,
    @Query() query: Record<string, string>,
  ): Promise<{ devices: IFilteredDevices[]; totalCount: number }> {
    const result = await this.devicesService.findAll(query, city);
    const { devices, totalCount } = result;
    return { devices, totalCount };
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
