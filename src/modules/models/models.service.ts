import * as fs from 'fs';
import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  ManufacturerNotFoundException,
  ModelExistsException,
  ModelNotFoundException,
  TypeNotFoundException,
} from 'src/exceptions/device.exceptions';
import { ModelDto } from './dto/model.dto';

@Injectable()
export class ModelsService {
  constructor(private prisma: PrismaService) {}
  // GET DEVICE MODELS
  async getModels(manufacturer: string, type: string) {
    const existingType = await this.prisma.device_type.findUnique({
      where: { slug: type },
    });
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { slug: manufacturer },
    });
    if (!existingType || !existingManufacturer)
      throw new ModelNotFoundException();

    const models = await this.prisma.device_model.findMany({
      where: {
        manufacturerId: existingManufacturer.id,
        typeId: existingType.id,
      },
    });
    return models;
  }
  //GET MODEL BY ID
  async getModelById(id: string) {
    const existModel = await this.prisma.device_model.findUnique({
      where: { id: id },
    });
    const [manufacturer, type] = await Promise.all([
      this.prisma.manufacturer.findUnique({
        where: { id: existModel.manufacturerId },
      }),
      this.prisma.device_type.findUnique({
        where: { id: existModel.typeId },
      }),
    ]);
    if (!manufacturer) throw new ManufacturerNotFoundException();
    if (!type) throw new TypeNotFoundException();
    return {
      ...existModel,
      manufacturer: manufacturer.name,
      type: type.name,
    };
  }
  // GET ALL MODElS
  async getAllModels() {
    const models = await this.prisma.device_model.findMany({});
    return models;
  }
  // CREATE DEVICE MODEL
  async createModel(deviceModelDto: ModelDto, file: Express.Multer.File) {
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: deviceModelDto.manufacturerId },
    });
    if (!existingManufacturer) throw new ManufacturerNotFoundException();
    const existingModel = await this.prisma.device_model.findFirst({
      where: {
        name: deviceModelDto.name,
        manufacturerId: deviceModelDto.manufacturerId,
      },
    });
    if (existingModel) throw new ModelExistsException();
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
  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = Date.now();
    const fileName = `${file?.fieldname}-${uniqueSuffix}${extname(file?.originalname)}`;
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
