import { DeviceDto, DeviceModelDto } from './dtos/device.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, HttpStatus,
  UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileUploadInterceptor } from './decorators/file-upload.decorator';
import { DevicesService } from './devices.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { allowedPictureOptions } from 'src/common/utils/constants';

@Controller('devices')
export class DevicesController {
  constructor(
    private devicesService: DevicesService,
    ) {}
  @Get()
  async findAll() {
    return this.devicesService.findAll();
  }

  @Post()
  @FileUploadInterceptor(allowedPictureOptions)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: join(process.cwd(), 'uploads/devices'),
  //       filename: (_req, file, callback) => {
  //         const uniqueSuffix = Date.now();
  //         const newFileName = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
  //         callback(null, newFileName);
  //       },
  //     }),
  //   }),
  // )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: DeviceDto,
  ): Promise<void> {}

  @Get('/models/:manufacturer/:type')
  async getModel(
      @Param('manufacturer') manufacturer: string,
      @Param('type') type: string) {
      return await this.devicesService.getModels(manufacturer, type);
  }
  // Create device model
  @Post('/models')
  @FileUploadInterceptor(allowedPictureOptions)
  async createModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() deviceModelDto: DeviceModelDto) {
    const model = await this.devicesService.createModel(deviceModelDto, file);
    return {
      message: 'Модель добавлена!',
      model,
    };
  }
  // Create device type
  @Post('/types')
  async createType(@Body() typeDto: Pick<DeviceModelDto, 'name' | 'slug'>) {
    const type = await this.devicesService.createType(typeDto);
    return {
      message: 'Тип добавлен!',
      type,
    };
  }
  @Get('/types')
  async getTypes() {
    return await this.devicesService.getTypes();
  }

  @Post('/manufacturers')
  async createManufacturer(
    @Body() manufacturerDto: Pick<DeviceModelDto, 'name' | 'slug'>) {
      console.log(manufacturerDto);
      
    const manufacturer = await this.devicesService.createManufacturer(manufacturerDto);
    return {
      message: 'Производитель добавлен!',
      manufacturer,
    };
  }

  @Get('/manufacturers')
  async getManufacturers() {
    return await this.devicesService.getManufacturers();
  }
}
