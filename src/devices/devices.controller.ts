import { DeviceDto, DeviceModelDto } from './dto/device.dto';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, HttpStatus, 
  UseGuards, UploadedFile, UseInterceptors, HttpException, BadRequestException } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname, join} from 'path';

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
      })
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: DeviceDto,
  ): Promise<void> {

  }

  @Post('/model')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 1 * 1024 * 1024
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];

        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Что-то пошло не так!', {
              cause: new Error,
              description: 'Недопустимый формат файла! Разрешены(jpg, jpeg, png)'
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
    @Body() deviceModelDto: DeviceModelDto){
    if (file.size > 1 * 1024 * 1024) {
      return new  BadRequestException('Что-то пошло не так!', {
        cause: new Error,
        description: 'Вес файла превышает 1МБ'
      })}
    console.log(file);
    console.log(deviceModelDto);
    
    const model = await this.devicesService.createModel(deviceModelDto, file);
    return {
      message: 'Модель добавлена!',
      model
    }
  }

  @Get('/manufacturers')
  async getManufacturers() {
    const manu =  await this.devicesService.getManufacturers();
    console.log(manu);
    
  }

  @Post('/manufacturer')
  async createManufacturer(
    @Body()manufacturerDto: Pick<DeviceModelDto, 'name' | 'slug'>) {
      const manufacturer = await this.devicesService.createManufacturer(manufacturerDto);

      return {
        message: 'Производитель добавлен!',
        manufacturer
      }
    }

}
