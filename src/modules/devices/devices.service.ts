import {
  IDeviceOptions,
  IAggregatedDeviceInfo,
  IFilteredDevices,
  IDeviceIssue,
} from 'src/common/types/device.types';
import {
  DeviceExistsException,
  DeviceNotFoundException,
  WarrantyValidateException,
} from 'src/exceptions/device.exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { DeviceBaseDto } from './dtos/device-base.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}
  // All
  async findAll(
    query: Record<string, string>,
    city: string,
  ): Promise<{ devices: IFilteredDevices[]; totalPages: number }> {
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
    if (query.screenSize)
      where.screenSize = { in: query.screenSize.split(',').map(Number) };
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
        deviceIssues: {
          where: { status: 'approved' },
          include: { user: true },
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
    return {
      ...device,
      deviceIssues: device.deviceIssues.map((issue: IDeviceIssue) => ({
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

  // Create
  async createDevice(
    deviceDto: CreateDeviceDto,
  ): Promise<Partial<DeviceBaseDto>> {
    const { providerName, warrantyNumber, startWarrantyDate, endWarrantyDate } =
      deviceDto;
    // Validate warranty fields
    if (
      providerName ||
      warrantyNumber ||
      startWarrantyDate ||
      endWarrantyDate
    ) {
      if (
        !(
          providerName &&
          warrantyNumber &&
          startWarrantyDate &&
          endWarrantyDate
        )
      ) {
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
  async updateDevice(
    deviceId: string,
    deviceDto: UpdateDeviceDto,
  ): Promise<DeviceBaseDto> {
    const existDevice = await this.prisma.device.findUnique({
      where: { id: deviceId },
    });
    if (!existDevice) throw new DeviceNotFoundException();

    const { providerName, warrantyNumber, startWarrantyDate, endWarrantyDate } =
      deviceDto;
    if (
      providerName ||
      warrantyNumber ||
      startWarrantyDate ||
      endWarrantyDate
    ) {
      if (
        !(
          providerName &&
          warrantyNumber &&
          startWarrantyDate &&
          endWarrantyDate
        )
      ) {
        throw new WarrantyValidateException();
      }
    }
    const updatedDevice = await this.prisma.device.update({
      where: { id: existDevice.id },
      data: {
        name: deviceDto.name,
        inventoryNumber: deviceDto.inventoryNumber
          ? deviceDto.inventoryNumber
          : null,
        modelId: deviceDto.modelId ? deviceDto.modelId : null,
        modelCode: deviceDto.modelCode ? deviceDto.modelCode : null,
        serialNumber: deviceDto.serialNumber ? deviceDto.serialNumber : null,
        weight: deviceDto.weight === 0 ? null : deviceDto.weight,
        screenSize: deviceDto.screenSize === 0 ? null : deviceDto.screenSize,
        memorySize: deviceDto.memorySize === 0 ? null : deviceDto.memorySize,
        isFunctional: deviceDto.isFunctional,
        description: deviceDto.description,
        price_without_vat:
          deviceDto.price_without_vat === 0
            ? null
            : deviceDto.price_without_vat,
        price_with_vat:
          deviceDto.price_with_vat === 0 ? null : deviceDto.price_with_vat,
        residual_price:
          deviceDto.residual_price === 0 ? null : deviceDto.residual_price,
        updatedById: deviceDto.updatedById,
      },
    });
    const existContractor = await this.prisma.contractor.findUnique({
      where: {
        name: deviceDto.providerName.trim(),
      },
    });
    if (existContractor) {
      await this.warrantyAction(deviceDto, existContractor.id, deviceId);
    }
    return {
      ...updatedDevice,
      price_with_vat: updatedDevice.price_with_vat?.toNumber(),
      price_without_vat: updatedDevice.price_without_vat?.toNumber(),
      residual_price: updatedDevice.residual_price?.toNumber(),
    };
  }

  warrantyAction = async (
    deviceDto: UpdateDeviceDto,
    id: string,
    deviceId: string,
  ) => {
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
