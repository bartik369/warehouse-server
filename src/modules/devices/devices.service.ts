import {
  IDeviceOptions,
  IDevice,
  IAggregatedDeviceInfo,
} from 'src/common/types/device.types';
import {
  DeviceExistsException,
  WarrantyValidateException,
} from 'src/exceptions/device.exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { DeviceDto } from './dtos/device.dto';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, string>, city: string): Promise<any> {
    const where: Record<string, any> = {};
    if (city) {
      where.warehouse = {
        location: { slug: city.trim() },
      };
    }
    const checkQueryArray = (field: string) => {
      if (Array.isArray(query[field])) {
        return query[field];
      } else {
        return query[field]?.split(',').map((item) => item.trim());
      }
    };
    if (query?.manufacturer) {
      where.model = where.model || {};
      where.model.manufacturer = {
        slug: { in: checkQueryArray('manufacturer') },
      };
    }
    if (query?.model) {
      where.model = where.model || {};
      where.model = { slug: { in: checkQueryArray('model') } };
    }
    if (query?.type) {
      where.model = where.model || {};
      where.model.type = { slug: { in: checkQueryArray('type') } };
    }
    if (query?.warehouse) {
      where.warehouse = { slug: { in: checkQueryArray('warehouse') } };
    }
    if (query.memorySize) where.memorySize = Number(query.memorySize);
    if (query.screenSize) where.screenSize = { in: query.screenSize.split(',').map(Number) };
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
    const limit = Number(query.limit) || 20;
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
            select: { name: true, slug: true },
          },
          model: {
            select: {
              name: true,
              slug: true,
              type: {
                select: { name: true, slug: true },
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
  // GET DEVICE
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
              select: { name: true },
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
              select: { name: true },
            },
          },
        },
        deviceIssues: {
          where: { status: 'approved' },
          include: { user: true },
        },
        addedBy: {
          select: { firstNameEn: true, lastNameEn: true },
        },
        updatedBy: {
          select: { firstNameEn: true, lastNameEn: true },
        },
      },
    });
    if (!device) throw new BadRequestException();
    return {
      ...device,
      deviceIssues: device.deviceIssues.map((issue) => ({
        firstNameEn: issue.user.firstNameEn,
        lastNameEn: issue.user.lastNameEn,
      })),
    };
  }

  async deviceHistory() {
    const history = await this.prisma.device.findMany({
      include: {
        deviceIssues: {
          include: { user: true, issuedBy: true },
        },
        deviceReturns: {
          include: { user: true, returnedBy: true },
        },
      },
    });
    return history;
  }

  // GET DEVICE OPTIONS
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
          .map((items) => [
            items.model.manufacturer.slug,
            items.model.manufacturer,
          ]),
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
          .map((items) => [
            items.model.slug,
            { name: items.model.name, slug: items.model.slug },
          ]),
      ).values(),
    );

    const warehouses = Array.from(
      new Map(
        devicesByLocation.map((item) => [item.warehouse?.slug, item.warehouse]),
      ).values(),
    );

    const screenSizes = Array.from(
      new Set(
        devicesByLocation
          .filter((item) => item.screenSize != null)
          .map((item) => item.screenSize),
      ),
    ).map((size) => ({ screenSize: size }));

    const memorySizes = Array.from(
      new Set(
        devicesByLocation
          .filter((item) => item.memorySize != null)
          .map((item) => item.memorySize),
      ),
    ).map((size) => ({ memorySize: size }));

    const isFunctional = Array.from(
      new Set(devicesByLocation.map((item) => item.isFunctional)),
    ).map((status) => ({ isFunctional: status }));

    const isAssigned = Array.from(
      new Set(devicesByLocation.map((item) => item.isAssigned)),
    ).map((status) => ({ isAssigned: status }));

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

  // CREATE DEVICE
  async createDevice(deviceDto: DeviceDto): Promise<Partial<IDevice>> {
    const { provider, warrantyNumber, startWarrantyDate, endWarrantyDate } =
      deviceDto;

    if (deviceDto.serialNumber || deviceDto.inventoryNumber) {
      const existingDevice = await this.prisma.device.findUnique({
        where: {
          serialNumber: deviceDto.serialNumber?.trim(),
          inventoryNumber: deviceDto.inventoryNumber?.trim(),
        },
      });
      if (existingDevice) throw new DeviceExistsException();
    }
    // Validate warranty fields
    if (provider || warrantyNumber || startWarrantyDate || endWarrantyDate) {
      if (
        !(provider && warrantyNumber && startWarrantyDate && endWarrantyDate)
      ) {
        throw new WarrantyValidateException();
      }
    }
    // Create device
    const device = await this.prisma.device.create({
      data: {
        name: deviceDto.name?.trim(),
        inventoryNumber:
          deviceDto.inventoryNumber?.trim() !== ''
            ? deviceDto.inventoryNumber
            : null,
        modelId: deviceDto.modelId?.trim() !== '' ? deviceDto.modelId : null,
        modelCode: deviceDto.modelCode || null,
        serialNumber: deviceDto.serialNumber?.trim(),
        weight: deviceDto.weight === 0 ? null : deviceDto.weight,
        screenSize: deviceDto.screenSize === 0 ? null : deviceDto.screenSize,
        memorySize: deviceDto.memorySize === 0 ? null : deviceDto.memorySize,
        inStock: deviceDto.inStock,
        price_with_vat:
          deviceDto.price_with_vat === 0 ? null : deviceDto.price_with_vat,
        price_without_vat:
          deviceDto.price_without_vat === 0
            ? null
            : deviceDto.price_without_vat,
        residual_price:
          deviceDto.residual_price === 0 ? null : deviceDto.residual_price,
        isFunctional: deviceDto.isFunctional,
        isAssigned: deviceDto.isAssigned,
        warehouseId: deviceDto.warehouseId,
        description: deviceDto.description || '',
        addedById: deviceDto.addedById,
        updatedById: deviceDto.addedById,
      },
    });
    const existContractor = await this.prisma.contractor.findUnique({
      where: {
        id: deviceDto.contractorId,
      },
    });
    // Create warranty record with created device info
    if (existContractor && device) {
      await this.prisma.warranty.create({
        data: {
          deviceId: device.id,
          warrantyNumber: deviceDto.warrantyNumber?.trim(),
          startWarrantyDate: deviceDto.startWarrantyDate,
          endWarrantyDate: deviceDto.endWarrantyDate,
          provider: existContractor.name?.trim(),
          contractorId: existContractor.id?.trim(),
        },
      });
    }

    if (device) return device;
  }
}
