import { DeviceDto, DeviceModelDto } from './dtos/device.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileUploadInterceptor } from './decorators/file-upload.decorator';
import { DevicesService } from './devices.service';
import {
  allowedPictureOptions,
  deviceCreated,
  manufacturerCreated,
  modelCreated,
  typeCreated,
} from 'src/common/utils/constants';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  async createDevice(@Body() deviceDto: DeviceDto) {
    const device = await this.devicesService.createDevice(deviceDto);
    return {
      message: deviceCreated,
      device,
    };
  }

  @Get('/models/:manufacturer/:type')
  async getModel(
    @Param('manufacturer') manufacturer: string,
    @Param('type') type: string,
  ) {
    const models = await this.devicesService.getModels(manufacturer, type);
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
      message: modelCreated,
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
      message: typeCreated,
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
      message: manufacturerCreated,
      manufacturer,
    };
  }

  // Get devices manufacturers
  @Get('/manufacturers')
  async getManufacturers() {
    return await this.devicesService.getManufacturers();
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
    const device = await this.devicesService.getDevice(id);
    return device;
  }
}
