import { DeviceDto, DeviceModelDto } from './dto/device.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, HttpStatus, 
  UseGuards, UploadedFile, UseInterceptors, HttpException } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join } from 'path';

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

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads/devices'),
        filename: (_req, file, callback) => {
          const uniqueSuffix = Date.now();
          const newFileName = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
          callback(null, newFileName);
        },
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: DeviceDto,
  ): Promise<void> {
    console.log(file);
    console.log(body);
    // return this.devicesService.create(deviceDto);
  }

  @Post('/model')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Храним файл в памяти до проверки
    }),
  )
  async createModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() deviceModelDto: DeviceModelDto,
  ) {
    return await this.devicesService.createModel(deviceModelDto, file);
  }
}
