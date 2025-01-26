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
  BadRequestException,
} from '@nestjs/common';
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
  ): Promise<void> {}

  @Get('/models/:manufacturer/:type')
  async getModel(
      @Param('manufacturer') manufacturer: string,
      @Param('type') type: string) {
      return await this.devicesService.getModels(manufacturer, type);
  }

  @Post('/models')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Что-то пошло не так!', {
              cause: new Error(),
              description:
                'Недопустимый формат файла! Разрешены(jpg, jpeg, png)',
            }),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() deviceModelDto: DeviceModelDto,
  ) {
    if (file.size > 1 * 1024 * 1024) {
      return new BadRequestException('Что-то пошло не так!', {
        cause: new Error(),
        description: 'Вес файла превышает 1МБ',
      });
    }
    const model = await this.devicesService.createModel(deviceModelDto, file);
    return {
      message: 'Модель добавлена!',
      model,
    };
  }

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
    const manufacturer =
      await this.devicesService.createManufacturer(manufacturerDto);
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
