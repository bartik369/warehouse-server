import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import {
  IAggregatedDeviceInfo,
  IDeviceOptions,
  IFilteredDevices,
} from 'src/common/types/device.types';
import {
  DeviceExistsException,
  DeviceNotFoundException,
  WarrantyValidateException,
} from 'src/exceptions/device.exceptions';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { DeviceBaseDto } from './dtos/device-base.dto';
import { DeviceCombineDto } from './dtos/device-combine.dto';
import { GetDevicesQueryDto } from './dtos/get-devices.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}
  // All
  async findAll(
    query: GetDevicesQueryDto,
    city: string,
  ): Promise<{ devices: IFilteredDevices[]; totalCount: number }> {
    const {
      page = 1,
      limit = 20,
      warehouseIds,
      manufacturerIds,
      typeIds,
      displaySize,
      memorySize,
      isFunctional,
      search,
      isAvailable,
    } = query;

    if (page <= 0 || limit <= 0) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const where: Prisma.deviceWhereInput = {
      warehouse: {
        location: {
          slug: city.trim(),
        },
      },
    };

    if (warehouseIds?.length) {
      where.warehouseId = {
        in: warehouseIds,
      };
    }

    if (isFunctional !== undefined) {
      where.isFunctional = isFunctional;
    }

    if (isAvailable !== undefined) {
      where.isAssigned = !isAvailable;
    }

    if (manufacturerIds?.length || typeIds?.length) {
      where.model = {
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
      };
    }

    if (displaySize) {
      const [min, max] = displaySize;

      where.screenSize = {
        gte: min,
        lte: max,
      };
    }

    if (memorySize) {
      const [min, max] = memorySize;

      where.memorySize = {
        gte: min,
        lte: max,
      };
    }

    if (search?.trim()) {
      const value = search.trim();

      where.OR = [
        {
          inventoryNumber: {
            contains: value,
            mode: 'insensitive',
          },
        },
        {
          serialNumber: {
            contains: value,
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [devices, totalCount] = await Promise.all([
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
              id: true,
              name: true,
              slug: true,
              locationId: true,
              comment: true,
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
        skip,
      }),

      this.prisma.device.count({
        where,
      }),
    ]);

    return {
      devices,
      totalCount,
    };
  }
  async getIssueDevices(issueId: string): Promise<DeviceCombineDto[]> {
    const issue = await this.prisma.device_issue_process.findUnique({
      where: {
        id: issueId,
      },
      include: {
        deviceIssues: {
          include: {
            device: {
              include: {
                model: {
                  include: {
                    manufacturer: true,
                    type: true,
                  },
                },
                warranty: {
                  include: {
                    contractor: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!issue) throw new BadRequestException();

    return issue.deviceIssues
      .filter((item) => item.device !== null)
      .map((item) => {
        const device = item.device!;

        return {
          id: device.id,
          name: device.name,
          inventoryNumber: device.inventoryNumber ?? undefined,
          modelId: device.modelId ?? undefined,
          modelCode: device.modelCode ?? undefined,
          modelName: device.model?.name,
          typeName: device.model?.type?.name,
          typeSlug: device.model?.type?.slug,
          manufacturerName: device.model?.manufacturer?.name ?? '',
          serialNumber: device.serialNumber ?? undefined,
          weight: device.weight ?? undefined,
          screenSize: device.screenSize ?? undefined,
          memorySize: device.memorySize ?? undefined,
          inStock: device.inStock,
          isFunctional: device.isFunctional,
          isAssigned: device.isAssigned,
          warehouseId: device.warehouseId ?? '',
          description: device.description ?? undefined,
          addedById: device.addedById,
          updatedById: device.updatedById,
          lastIssuedAt: device.lastIssuedAt,
          lastReturnedAt: device.lastReturnedAt,
          createdAt: device.createdAt,
          updatedAt: device.updatedAt,
          price_without_vat: device.price_without_vat?.toNumber() ?? 0,
          price_with_vat: device.price_with_vat?.toNumber() ?? 0,
          residual_price: device.residual_price?.toNumber() ?? 0,
          contractorId: device.warranty?.contractorId ?? undefined,
          providerName: device.warranty?.provider ?? undefined,
          warrantyNumber: device.warranty?.warrantyNumber ?? undefined,
          startWarrantyDate: device.warranty?.startWarrantyDate?.toISOString(),
          endWarrantyDate: device.warranty?.endWarrantyDate?.toISOString(),
        };
      });
  }

  async searchDevices(query: string, warehouseId: string): Promise<DeviceBaseDto[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        warehouseId,
        inStock: true,
        isAssigned: false,

        OR: [
          {
            inventoryNumber: {
              startsWith: query,
              mode: 'insensitive',
            },
          },
          {
            serialNumber: {
              startsWith: query,
              mode: 'insensitive',
            },
          },
          {
            modelCode: {
              startsWith: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            slug: true,

            manufacturer: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },

            type: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            slug: true,
            locationId: true,
          },
        },
        warranty: {
          select: {
            warrantyNumber: true,
            provider: true,
            contractorId: true,
            startWarrantyDate: true,
            endWarrantyDate: true,

            contractor: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
    return devices.map((device): DeviceBaseDto => {
      const { price_with_vat, price_without_vat, residual_price, ...rest } = device;

      return {
        ...rest,

        price_with_vat: price_with_vat?.toNumber() ?? null,
        price_without_vat: price_without_vat?.toNumber() ?? null,
        residual_price: residual_price?.toNumber() ?? null,
      };
    });
  }

  // Get by ID
  async getDevice(id: string): Promise<IAggregatedDeviceInfo> {
    const device = await this.prisma.device.findUnique({
      where: { id: id },
      include: {
        warehouse: {
          select: { name: true, slug: true },
        },
        model: {
          select: {
            name: true,
            imagePath: true,
            manufacturer: {
              select: { name: true, slug: true, id: true },
            },
            type: {
              select: { name: true, slug: true },
            },
          },
        },
        warranty: {
          select: {
            warrantyNumber: true,
            startWarrantyDate: true,
            endWarrantyDate: true,
            warrantyStatus: true,
            isExpired: true,
            contractor: {
              select: { name: true, slug: true },
            },
          },
        },
        addedBy: {
          select: {
            firstNameRu: true,
            lastNameRu: true,
            firstNameEn: true,
            lastNameEn: true,
          },
        },
        updatedBy: {
          select: {
            firstNameRu: true,
            lastNameRu: true,
            firstNameEn: true,
            lastNameEn: true,
          },
        },
      },
    });
    if (!device) throw new BadRequestException();
    return device;
  }
  // async deviceHistory() {
  //   const history = await this.prisma.device.findMany({
  //     include: {
  //       deviceIssues: {
  //         include: { user: true, issuedBy: true },
  //       },
  //       deviceReturns: {
  //         include: { user: true, returnedBy: true },
  //       },
  //     },
  //   });
  //   return history;
  // }

  // Options
  async getOptions(city: string): Promise<IDeviceOptions> {
    const where: Record<string, any> = city
      ? {
          warehouse: {
            location: { slug: city },
          },
        }
      : {};

    const devicesByLocation = (await this.prisma.device.findMany({
      where,
      select: {
        model: {
          select: {
            manufacturer: { select: { name: true, slug: true } },
            type: { select: { name: true, slug: true } },
            name: true,
            slug: true,
          },
        },
        warehouse: { select: { name: true, slug: true } },
        screenSize: true,
        memorySize: true,
        isAssigned: true,
        isFunctional: true,
      },
    })) as {
      model: {
        manufacturer: { name: string; slug: string };
        type: { name: string; slug: string };
        name: string;
        slug: string;
      };
      warehouse?: { name: string; slug: string };
      screenSize?: number;
      memorySize?: number;
      isFunctional: boolean;
      isAssigned: boolean;
    }[];

    const manufacturers = Array.from(
      new Map(
        devicesByLocation
          .filter((items) => items.model?.manufacturer)
          .map((items) => [items.model.manufacturer.slug, items.model.manufacturer]),
      ).values(),
    );

    const types = Array.from(
      new Map(
        devicesByLocation
          .filter((items) => items.model?.type)
          .map((items) => [items.model.type.slug, items.model.type]),
      ).values(),
    );

    const models = Array.from(
      new Map(
        devicesByLocation
          .filter((items) => items.model)
          .map((items) => [items.model.slug, { name: items.model.name, slug: items.model.slug }]),
      ).values(),
    );

    const warehouses = Array.from(
      new Map(devicesByLocation.map((item) => [item.warehouse?.slug, item.warehouse])).values(),
    );

    const screenSizes = Array.from(
      new Set(
        devicesByLocation.filter((item) => item.screenSize != null).map((item) => item.screenSize),
      ),
    ).map((size) => ({ screenSize: size }));

    const memorySizes = Array.from(
      new Set(
        devicesByLocation.filter((item) => item.memorySize != null).map((item) => item.memorySize),
      ),
    ).map((size) => ({ memorySize: size }));

    const isFunctional = Array.from(
      new Set(devicesByLocation.map((item) => item.isFunctional)),
    ).map((status) => ({ isFunctional: status }));

    const isAssigned = Array.from(new Set(devicesByLocation.map((item) => item.isAssigned))).map(
      (status) => ({ isAssigned: status }),
    );

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
  async getAssignedDevicesByUser(userId: string): Promise<DeviceBaseDto[]> {
    const devices = await this.prisma.device.findMany({
      where: {
        assignedUserId: userId,
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            slug: true,
            manufacturer: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            type: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            slug: true,
            locationId: true,
          },
        },
        warranty: {
          select: {
            warrantyNumber: true,
            startWarrantyDate: true,
            endWarrantyDate: true,
            provider: true,
            contractorId: true,
            contractor: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return devices.map((device): DeviceBaseDto => {
      const { price_with_vat, price_without_vat, residual_price, ...rest } = device;

      return {
        ...rest,
        price_with_vat: price_with_vat?.toNumber() ?? null,
        price_without_vat: price_without_vat?.toNumber() ?? null,
        residual_price: residual_price?.toNumber() ?? null,
      };
    });
  }

  // Create
  async createDevice(deviceDto: CreateDeviceDto): Promise<Partial<DeviceBaseDto>> {
    const { providerName, warrantyNumber, startWarrantyDate, endWarrantyDate } = deviceDto;
    // Validate warranty fields
    if (providerName || warrantyNumber || startWarrantyDate || endWarrantyDate) {
      if (!(providerName && warrantyNumber && startWarrantyDate && endWarrantyDate)) {
        throw new WarrantyValidateException();
      }
    }
    if (deviceDto.serialNumber || deviceDto.inventoryNumber) {
      const existingDevice = await this.prisma.device.findUnique({
        where: {
          serialNumber: deviceDto.serialNumber?.trim(),
          inventoryNumber: deviceDto.inventoryNumber?.trim(),
        },
      });
      if (existingDevice) throw new DeviceExistsException();
    }
    // Create device
    const device = await this.prisma.device.create({
      data: {
        name: deviceDto.name,
        inventoryNumber: deviceDto.inventoryNumber || null,
        modelId: deviceDto.modelId || null,
        modelCode: deviceDto.modelCode || null,
        serialNumber: deviceDto.serialNumber || null,
        weight: deviceDto.weight === 0 ? null : deviceDto.weight,
        screenSize: deviceDto.screenSize === 0 ? null : deviceDto.screenSize,
        memorySize: deviceDto.memorySize === 0 ? null : deviceDto.memorySize,
        inStock: deviceDto.inStock,
        price_with_vat: deviceDto.price_with_vat === 0 ? null : deviceDto.price_with_vat,
        price_without_vat: deviceDto.price_without_vat === 0 ? null : deviceDto.price_without_vat,
        residual_price: deviceDto.residual_price === 0 ? null : deviceDto.residual_price,
        isFunctional: deviceDto.isFunctional,
        isAssigned: deviceDto.isAssigned,
        warehouseId: deviceDto.warehouseId,
        description: deviceDto.description || '',
        addedById: deviceDto.addedById,
        updatedById: deviceDto.addedById,
      },
    });
    if (deviceDto.contractorId) {
      const existContractor = await this.prisma.contractor.findUnique({
        where: { id: deviceDto.contractorId },
      });
      // Create warranty record with created device info
      if (existContractor && device) {
        await this.warrantyAction(deviceDto, existContractor.id, device.id);
      }
    }
    if (device) {
      return {
        ...device,
        price_with_vat: device.price_with_vat.toNumber() ?? null,
        price_without_vat: device.price_without_vat.toNumber() ?? null,
        residual_price: device.residual_price.toNumber() ?? null,
      };
    }
  }
  //Update
  async updateDevice(deviceId: string, deviceDto: UpdateDeviceDto): Promise<DeviceBaseDto> {
    const existDevice = await this.prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });

    if (!existDevice) {
      throw new DeviceNotFoundException();
    }

    const { providerName, warrantyNumber, startWarrantyDate, endWarrantyDate } = deviceDto;

    if (providerName || warrantyNumber || startWarrantyDate || endWarrantyDate) {
      if (!(providerName && warrantyNumber && startWarrantyDate && endWarrantyDate)) {
        throw new WarrantyValidateException();
      }
    }

    const updatedDevice = await this.prisma.device.update({
      where: {
        id: existDevice.id,
      },
      data: {
        name: deviceDto.name,
        inventoryNumber: deviceDto.inventoryNumber ? deviceDto.inventoryNumber : null,
        modelId: deviceDto.modelId ? deviceDto.modelId : null,
        modelCode: deviceDto.modelCode ? deviceDto.modelCode : null,
        serialNumber: deviceDto.serialNumber ? deviceDto.serialNumber : null,
        weight: deviceDto.weight === 0 ? null : deviceDto.weight,
        screenSize: deviceDto.screenSize === 0 ? null : deviceDto.screenSize,
        memorySize: deviceDto.memorySize === 0 ? null : deviceDto.memorySize,
        isFunctional: deviceDto.isFunctional,
        description: deviceDto.description,
        price_without_vat: deviceDto.price_without_vat === 0 ? null : deviceDto.price_without_vat,
        price_with_vat: deviceDto.price_with_vat === 0 ? null : deviceDto.price_with_vat,
        residual_price: deviceDto.residual_price === 0 ? null : deviceDto.residual_price,
        updatedById: deviceDto.updatedById,
      },
    });

    if (deviceDto.providerName) {
      const existContractor = await this.prisma.contractor.findUnique({
        where: {
          name: deviceDto.providerName.trim(),
        },
      });

      if (existContractor) {
        await this.warrantyAction(deviceDto, existContractor.id, deviceId);
      }
    }

    const device = await this.prisma.device.findUnique({
      where: {
        id: updatedDevice.id,
      },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            slug: true,
            manufacturer: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            type: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            slug: true,
            locationId: true,
          },
        },
        warranty: {
          select: {
            warrantyNumber: true,
            startWarrantyDate: true,
            endWarrantyDate: true,
            provider: true,
            contractorId: true,
            contractor: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!device) {
      throw new DeviceNotFoundException();
    }

    const { price_with_vat, price_without_vat, residual_price, ...rest } = device;

    return {
      ...rest,
      price_with_vat: price_with_vat?.toNumber() ?? null,
      price_without_vat: price_without_vat?.toNumber() ?? null,
      residual_price: residual_price?.toNumber() ?? null,
    };
  }

  warrantyAction = async (deviceDto: UpdateDeviceDto, id: string, deviceId: string) => {
    const warrantyData = {
      deviceId: deviceId || undefined,
      warrantyNumber: deviceDto.warrantyNumber || undefined,
      startWarrantyDate: deviceDto.startWarrantyDate || undefined,
      endWarrantyDate: deviceDto.endWarrantyDate || undefined,
      provider: deviceDto.providerName || undefined,
      contractorId: id?.trim() || undefined,
    };
    const existWarranty = await this.prisma.warranty.findUnique({
      where: { deviceId: deviceId || '' },
    });
    if (existWarranty) {
      await this.prisma.warranty.update({
        where: { id: existWarranty.id },
        data: { ...warrantyData },
      });
    } else {
      await this.prisma.warranty.create({
        data: { ...warrantyData },
      });
    }
  };
}
