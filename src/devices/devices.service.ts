import { DeviceDto } from './dto/device.dto';
import { DeviceModelDto } from './dto/device.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import { Injectable, ConflictException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any> {
    const devices = await this.prisma.device.findMany();
    return devices;
  }

  async create(deviceDto: DeviceDto) {
    console.log(deviceDto);
  }

  async createModel(deviceModelDto: DeviceModelDto, file: Express.Multer.File) {
    const existingModel = await this.prisma.device_model.findUnique({
      where: {
        name: deviceModelDto.name,
      },
    });

    if (existingModel) {
      throw new ConflictException('Что-то пошло не так', {
        cause: new Error,
        description: 'Модель уже существует!'
      });
    }
    const savedFilePath = await this.saveFile(file);

    // const model = await this.prisma.device_model.create({
    //   data: {
    //     name: deviceModelDto.name,
    //     slug: deviceModelDto.slug,
    //     imagePath: savedFilePath,
    //     typeId: deviceModelDto.typeId,
    //   },
    // });

    // return model;
  }

  async createManufacturer(manufacturerDto: Pick<DeviceModelDto, 'name' | 'slug'>) {
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        name: manufacturerDto.name,
      }
    });
    if (existingManufacturer) {
      throw new ConflictException('Что-то пошло не так', {
        cause: new Error,
        description: 'Производитель уже существует'
      })
    }
    const manufacturer = await this.prisma.manufacturer.create({
      data: {
        name: manufacturerDto.name,
        slug: manufacturerDto.slug,
      }
    });
    return manufacturer;
  }

  async getManufacturers() {
    const manufacturers = await this.prisma.manufacturer.findMany();
    return manufacturers
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = Date.now();
    const fileName = `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`;
    const filePath = `uploads/models/${fileName}`;

    // Save file to uploads/models/
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
            reject(new Error('Failed to save file'));
        }
        resolve(fileName);
      });
    });
  }
}
