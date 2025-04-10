import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { WarehouseDto } from './dtos/warehouseDto';
import {
  LocationNotFoundException,
  WarehouseExistException,
  WarehouseNotFoundException,
} from 'src/exceptions/location.exceptions';
import { ILocation } from 'src/common/types/location.types';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const warehouses = await this.prisma.warehouse.findMany();
    if (warehouses) return warehouses;
    return null;
  }
  // CREATE WAREHOUSE
  async createWarehouse(warehouseDto: WarehouseDto): Promise<ILocation> {
    const [existWarehouse, existLocation] = await Promise.all([
      this.prisma.warehouse.findUnique({
        where: { name: warehouseDto.name },
      }),
      this.prisma.location.findUnique({
        where: { name: warehouseDto.locationName },
      }),
    ]);

    if (existWarehouse) throw new WarehouseExistException();
    if (!existLocation) throw new LocationNotFoundException();
    const warehouse = await this.prisma.warehouse.create({
      data: {
        name: warehouseDto.name?.trim(),
        slug: warehouseDto.slug?.trim(),
        locationId: existLocation.id,
        comment: warehouseDto.comment || '',
      },
    });
    return warehouse;
  }
  async getWarehouse(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: id },
      include: {
        location: {
          select: { name: true },
        },
      },
    });
    if (!warehouse) return null;
    const { location, ...rest } = warehouse;
    return { ...rest, locationName: location?.name || null };
  }
  async updateWarehouse(id: string, warehouseDto: WarehouseDto) {
    const existWarehouse = await this.prisma.warehouse.findUnique({
      where: { id: id },
    });
    if (!existWarehouse) throw new WarehouseNotFoundException();
    const updatedWarehouse = await this.prisma.warehouse.update({
      where: { id: id },
      data: {
        name: warehouseDto.name?.trim(),
        slug: warehouseDto.slug?.trim(),
        comment: warehouseDto.comment || '',
      },
    });
    return updatedWarehouse;
  }
}
