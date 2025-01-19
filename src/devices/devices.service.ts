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
        manufacturer: deviceModelDto.manufacturer,
      },
    });

    if (existingModel) {
      throw new ConflictException('Модель уже существует');
    }
    const savedFilePath = await this.saveFile(file);

    const model = await this.prisma.device_model.create({
      data: {
        name: deviceModelDto.name,
        manufacturer: deviceModelDto.manufacturer,
        imagePath: savedFilePath,
      },
    });

    return model;
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
