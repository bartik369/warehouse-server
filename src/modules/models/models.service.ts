import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { extname } from 'path';
import { PrismaService } from 'prisma/prisma.service';
import {
  ManufacturerNotFoundException,
  ModelExistsException,
  ModelNotFoundException,
  TypeNotFoundException,
} from 'src/exceptions/device.exceptions';
import { GetModelsQueryDto } from './dto/get-models.dto';
import { DeviceModelResponseDto, ModelBaseDto, SortedDeviceModelDto } from './dto/model-base.dto';
import { CreateModelDto } from './dto/model-create.dto';

@Injectable()
export class ModelsService {
  constructor(private prisma: PrismaService) {}

  async searchModels(query: GetModelsQueryDto): Promise<SortedDeviceModelDto> {
    const { page = 1, limit = 20, manufacturerIds, typeIds, search } = query;
    const where = {
      ...(manufacturerIds?.length && {
        manufacturerId: {
          in: manufacturerIds,
        },
      }),
      ...(typeIds?.length && {
        typeId: {
          in: typeIds,
        },
      }),
      ...(search?.trim() && {
        name: {
          contains: search.trim(),
          mode: 'insensitive' as const,
        },
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.device_model.findMany({
        where,
        include: {
          manufacturer: true,
          type: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),

      this.prisma.device_model.count({
        where,
      }),
    ]);

    console.log(total);

    return {
      items,
      total,
    };
  }
  async getModelsByManufacturerAndType(
    manufacturerId: string,
    typeId: string,
  ): Promise<ModelBaseDto[]> {
    return this.prisma.device_model.findMany({
      where: {
        manufacturerId,
        typeId,
      },
    });
    return;
  }
  // Get by ID
  async getModelById(id: string): Promise<ModelBaseDto & { manufacturer: string; type: string }> {
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
  async getAllModels(): Promise<DeviceModelResponseDto[]> {
    const models = await this.prisma.device_model.findMany({
      include: {
        manufacturer: true,
        type: true,
      },
    });
    return models;
  }
  // Create
  async createModel(modelDto: CreateModelDto, file: Express.Multer.File): Promise<ModelBaseDto> {
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: modelDto.manufacturerId },
    });
    if (!existingManufacturer) throw new ManufacturerNotFoundException();
    const existingModel = await this.prisma.device_model.findFirst({
      where: {
        name: modelDto.name,
        manufacturerId: modelDto.manufacturerId,
      },
    });
    if (existingModel) throw new ModelExistsException();
    const savedFilePath = await this.saveFile(modelDto.imagePath, file);
    const model = await this.prisma.device_model.create({
      data: {
        name: modelDto.name,
        slug: modelDto.slug,
        imagePath: savedFilePath,
        manufacturerId: existingManufacturer.id,
        typeId: modelDto.typeId,
      },
    });
    return model;
  }
  // Update
  async updateModel(modelDto: ModelBaseDto, file: Express.Multer.File): Promise<ModelBaseDto> {
    const existModel = await this.prisma.device_model.findUnique({
      where: { id: modelDto.id },
    });
    if (!existModel) throw new ModelNotFoundException();
    const model = await this.prisma.device_model.update({
      where: { id: existModel.id },
      data: {
        name: modelDto.name,
        slug: modelDto.slug,
        imagePath: file ? await this.saveFile(existModel.imagePath, file) : existModel.imagePath,
        manufacturerId: modelDto.manufacturerId,
        typeId: modelDto.typeId,
      },
    });
    return model;
  }
  private async saveFile(existFileName: string, file: Express.Multer.File): Promise<string> {
    const uniqueSuffix = Date.now();
    const fileName = `${file?.fieldname}-${uniqueSuffix}${extname(file?.originalname)}`;
    const filePath = `uploads/models/${fileName}`;
    const existFilePath = `uploads/models/${existFileName}`;
    try {
      if (fs.existsSync(existFilePath)) {
        await fs.promises.unlink(existFilePath);
      }
      await fs.promises.writeFile(filePath, file.buffer);
      return fileName;
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }
}
