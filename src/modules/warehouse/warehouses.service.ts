import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { WarehouseDto } from './dtos/warehouseDto';
import {
  CityExistException,
  WarehouseExistException,
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
    if (!existLocation) throw new CityExistException();
    const warehouse = await this.prisma.warehouse.create({
      data: {
        name: warehouseDto.name,
        slug: warehouseDto.slug,
        locationId: existLocation.id,
        comment: warehouseDto.comment,
      },
    });
    return warehouse;
  }
}
