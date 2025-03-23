import {
  DeviceDto,
  DeviceModelDto,
  DeviceTypeDto,
  ManufacturerDto,
} from './dtos/device.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  HttpStatus,
  UploadedFile,
  Query,
  Put,
  UsePipes,
  ValidationPipe,
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

@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
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
  @UsePipes(new ValidationPipe())
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
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createType(@Body() typeDto: DeviceTypeDto) {
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
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async createManufacturer(@Body() manufacturerDto: ManufacturerDto) {
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
  // Get  manufacturers
  @Get('/manufacturers/:id')
  async getManufacturer(@Param('id') id: string) {
    return await this.devicesService.getManufacturer(id);
  }

  @Put('/manufacturers/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateManufacturer(
    @Param('id') id: string,
    @Body() manufacturerDto: ManufacturerDto,
  ) {
    return await this.devicesService.updateManufacturer(id, manufacturerDto);
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
}
