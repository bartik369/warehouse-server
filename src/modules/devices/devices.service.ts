import { DeviceDto } from './dtos/device.dto';
import { DeviceModelDto } from './dtos/device.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
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
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: deviceModelDto.manufacturerId },
    });

    if (!existingManufacturer) {
      throw new NotFoundException('Производитель не найден', {
        cause: new Error(),
        description: `Производитель с id ${deviceModelDto.manufacturerId} не существует.`,
      });
    }
    const existingModel = await this.prisma.device_model.findFirst({
      where: {
        name: deviceModelDto.name,
        manufacturerId: deviceModelDto.manufacturerId,
      },
    });

    if (existingModel) {
      throw new ConflictException('Что-то пошло не так', {
        cause: new Error(),
        description: 'Модель уже существует!',
      });
    }

    const savedFilePath = await this.saveFile(file);
    const model = await this.prisma.device_model.create({
      data: {
        name: deviceModelDto.name,
        slug: deviceModelDto.slug,
        imagePath: savedFilePath,
        manufacturerId: existingManufacturer.id,
        typeId: deviceModelDto.typeId,
      },
    });
    return model;
  }

  async getModels(manufacturer: string, type: string) {
    const existingType = await this.prisma.device_type.findUnique({
      where: { slug: type },
    });
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { slug: manufacturer },
    });

    if (!existingType || !existingManufacturer) {
      throw new ConflictException();
    }
    const models = await this.prisma.device_model.findMany({
      where: {
        manufacturerId: existingManufacturer.id,
        typeId: existingType.id,
      },
    });
    return models;
  }

  async createManufacturer(
    manufacturerDto: Pick<DeviceModelDto, 'name' | 'slug'>,
  ) {
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { name: manufacturerDto.name },
    });
    if (existingManufacturer) {
      throw new ConflictException('Что-то пошло не так', {
        cause: new Error(),
        description: 'Производитель уже существует',
      });
    }
    const manufacturer = await this.prisma.manufacturer.create({
      data: {
        name: manufacturerDto.name,
        slug: manufacturerDto.slug,
      },
    });
    return manufacturer;
  }

  async createType(typeDto: Pick<DeviceModelDto, 'name' | 'slug'>) {
    const existingType = await this.prisma.device_type.findUnique({
      where: {
        name: typeDto.name,
        slug: typeDto.slug,
      },
    });

    if (existingType) {
      throw new ConflictException('Что-то пошло не так', {
        cause: new Error(),
        description: 'Тип уже существует',
      });
    }
    const type = await this.prisma.device_type.create({
      data: {
        name: typeDto.name,
        slug: typeDto.slug,
      },
    });
    return type;
  }

  async getManufacturers() {
    const manufacturers = await this.prisma.manufacturer.findMany();
    return manufacturers;
  }
  async getTypes() {
    const types = await this.prisma.device_type.findMany();
    return types;
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
