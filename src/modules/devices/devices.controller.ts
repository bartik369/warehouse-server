import { DeviceDto, DeviceModelDto } from './dtos/device.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileUploadInterceptor } from './decorators/file-upload.decorator';
import { DevicesService } from './devices.service';
import { allowedPictureOptions } from 'src/common/utils/constants';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Get('/locations/:city')
  async findAll(
    @Param('city') city: string,
    @Query() query: Record<string, string>,
  ) {
    return this.devicesService.findAll(query, city);
  }

  @Get('/options')
  async getOptions() {
    return await this.devicesService.getOptions();
  }

  @Post()
  async createDevice(@Body() deviceDto: DeviceDto) {
    const device = await this.devicesService.createDevice(deviceDto);
    return {
      message: 'Устройство добавлено!',
      device,
    };
  }

  @Get('/models/:manufacturer/:type')
  async getModel(
    @Param('manufacturer') manufacturer: string,
    @Param('type') type: string,
  ) {
    const models = this.devicesService.getModels(manufacturer, type);
    return models;
  }

  // Create device model
  @Post('/models')
  @HttpCode(HttpStatus.CREATED)
  @FileUploadInterceptor(allowedPictureOptions)
  async createModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() deviceModelDto: DeviceModelDto,
  ) {
    const model = await this.devicesService.createModel(deviceModelDto, file);
    return {
      message: 'Модель добавлена!',
      model,
    };
  }

  // Create device type
  @Post('/types')
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.CREATED)
  async createType(@Body() typeDto: Pick<DeviceModelDto, 'name' | 'slug'>) {
    const type = await this.devicesService.createType(typeDto);
    return {
      message: 'Тип добавлен!',
      type,
    };
  }

  // Get devices types
  @Get('/types')
  async getTypes() {
    return await this.devicesService.getTypes();
  }

  // Create device manufacturer
  @Post('/manufacturers')
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.CREATED)
  async createManufacturer(
    @Body() manufacturerDto: Pick<DeviceModelDto, 'name' | 'slug'>,
  ) {
    const manufacturer =
      await this.devicesService.createManufacturer(manufacturerDto);
    return {
      message: 'Производитель добавлен!',
      manufacturer,
    };
  }

  // Get devices manufacturers
  @Get('/manufacturers')
  async getManufacturers() {
    return await this.devicesService.getManufacturers();
  }
}
