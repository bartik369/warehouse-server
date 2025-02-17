import * as fs from 'fs';
import { extname } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DeviceDto } from './dtos/device.dto';
import { DeviceModelDto } from './dtos/device.dto';
import { PrismaService } from 'prisma/prisma.service';
import { IDeviceOptions, IDevice } from 'src/common/types/device.types';
import { ManufacturerExistsException, TypeExistsException,ModelExistsException,
  ManufacturerNotFoundException, ModelNotFoundException, DeviceExistsException } from 'src/exceptions/device.exceptions';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, string>, city:string):Promise<any> {
    const where: Record<string, any> = {};
    if (city) {
      where.warehouse = {
        location: {
          slug: city
        }
      }
    };

    if (query?.manufacturer) {
      const manufacturers = Array.isArray(query.manufacturer)
        ? query.manufacturer
        : query.manufacturer.split(',').map((item) => item.trim());
      where.model = where.model || {}
      where.model.manufacturer = { slug: { in: manufacturers } };
    }

    if (query?.model) {
      const models = Array.isArray(query.model)
        ? query.model
        : query.model.split(',').map((item) => item.trim());
      where.model = where.model || {}
      where.model = { slug: { in: models } };
    }
    if (query?.type) {
      const types = Array.isArray(query.type)
        ? query.type
        : query.type.split(',').map((item) => item.trim());
      where.model = where.model || {}
      where.model.type = { slug: { in: types } };
    }
    if (query?.warehouse) {
      const warehouses = Array.isArray(query.warehouse)
        ? query.warehouse
        : query.warehouse.split(',').map((item) => item.trim());
      where.warehouse = {slug: {in: warehouses }};
    }

    if (query.memorySize) {
      where.memorySize = Number(query.memorySize);
    }

    if (query.screenSize) {
      where.screenSize = { in: query.screenSize.split(',').map(Number) };
    }
    if (query.isFunctional) {
      const isFunctionalArray = Array.isArray(query.isFunctional)
        ? query.isFunctional
        : query.isFunctional.split(',').map((item) => item.trim() === 'true');

      if (isFunctionalArray.length === 1) {
        where.OR = [
          {
            isFunctional: isFunctionalArray[0],
          },
        ];
      }
    }
    if (query.isAssigned) {
      const isAssignedArray = Array.isArray(query.isAssigned)
        ? query.isAssigned
        : query.isAssigned.split(',').map((item) => item.trim() === 'true');
      
        if (isAssignedArray.length === 1) {
          where.isAssigned = isAssignedArray[0];
      }
    }
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    if (limit <= 0 || page <= 0) {
      throw new BadRequestException();
    }
    const skip = (page - 1) * limit;

    const [devices, total] = await Promise.all([
    this.prisma.device.findMany({
      where,
      select: {
        id: true,
        name: true,
        screenSize: true,
        memorySize: true,
        isFunctional: true,
        isAssigned: true,
        inventoryNumber: true,
        serialNumber: true,
        warehouse: {
          select: {
            name: true,
            slug: true,
          },
        },
        model: {
          select: {
            name: true,
            slug: true,
            type: {
              select: {
                name: true,
                slug: true,
              },
            },
            manufacturer: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: skip,
    }),
    this.prisma.device.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { devices, totalPages };
  }

  async getOptions():Promise<IDeviceOptions> {
    const manufacturers = await this.prisma.manufacturer.findMany({
      select: {
        name: true,
        slug: true,
      }
    }) as {name: string; slug: string}[];

    const types = await this.prisma.device_type.findMany({
      select: {
        name: true,
        slug: true,
      },
    }) as {name: string; slug: string}[];

    const models = await this.prisma.device_model.findMany({
      select: {
        name: true,
        slug: true,
      },
    }) as {name: string; slug: string}[];

    const warehouses = await this.prisma.warehouse.findMany({
      select: {
        name: true,
        slug: true,
      },
    }) as {name: string; slug: string}[];

    const screenSizes = await this.prisma.device.findMany({
      where: {
        screenSize: {
          not: null,
        },
      },
      select: {
        screenSize: true,
      },
      distinct: ['screenSize'],
    }) as {screenSize: number}[];

    const memorySizes = await this.prisma.device.findMany({
      where: {
        memorySize: {
          not: null,
        },
      },
      select: {
        memorySize: true,
      },
      distinct: ['memorySize'],
    })as {memorySize: number}[];

    const isFunctional = await this.prisma.device.findMany({
      select: {
        isFunctional: true,
      },
      distinct: ['isFunctional'],
    }) as { isFunctional: boolean}[];

    const isAssigned = await this.prisma.device.findMany({
      select: {
        isAssigned: true,
      },
      distinct: ['isAssigned'],
    }) as { isAssigned: boolean}[];
    
    return {
      manufacturer: manufacturers,
      type: types,
      model: models,
      warehouse: warehouses,
      screenSize: screenSizes,
      memorySize: memorySizes,
      isFunctional: isFunctional,
      isAssigned: isAssigned,
    };
  }

  async createDevice(deviceDto: DeviceDto):Promise<Partial<IDevice>> {
    if (deviceDto.serialNumber || deviceDto.inventoryNumber) {
      const existingDevice = await this.prisma.device.findUnique({
        where: {
          serialNumber: deviceDto.serialNumber,
          inventoryNumber: deviceDto.inventoryNumber,
        },
      });
      if (existingDevice) throw new DeviceExistsException();
    }
    const device = await this.prisma.device.create({
      data: {
        name: deviceDto.name,
        inventoryNumber:
          deviceDto.inventoryNumber && deviceDto.inventoryNumber.trim() !== ''
            ? deviceDto.inventoryNumber
            : null,
        modelId:
          deviceDto.modelId && deviceDto.modelId.trim() !== ''
            ? deviceDto.modelId
            : null,
        modelCode: deviceDto.modelCode,
        serialNumber: deviceDto.serialNumber,
        weight: deviceDto.weight === 0 ? null : deviceDto.weight,
        screenSize: deviceDto.screenSize === 0 ? null : deviceDto.screenSize,
        memorySize: deviceDto.memorySize === 0 ? null : deviceDto.memorySize,
        inStock: deviceDto.inStock,
        isFunctional: deviceDto.isFunctional,
        isAssigned: deviceDto.isAssigned,
        warehouseId: deviceDto.warehouseId,
        description: deviceDto.description,
        addedById: deviceDto.addedById,
        updatedById: deviceDto.addedById,
      },
    });

    if (device) return device;
  }

  async createModel(deviceModelDto: DeviceModelDto, file: Express.Multer.File) {
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

  async createManufacturer(
    manufacturerDto: Pick<DeviceModelDto, 'name' | 'slug'>,
  ) {
    const existingManufacturer = await this.prisma.manufacturer.findFirst({
      where: {
        name: manufacturerDto.name,
        slug: manufacturerDto.slug,
      },
    });
    if (existingManufacturer) throw new ManufacturerExistsException();

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
    if (existingType) throw new TypeExistsException();

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
