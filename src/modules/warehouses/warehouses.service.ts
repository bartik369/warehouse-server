import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { WarehouseBaseDto } from './dtos/warehouseBase.dto';
import {
  LocationNotFoundException,
  WarehouseExistException,
  WarehouseNotFoundException,
} from 'src/exceptions/location.exceptions';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';
import { UpdateWarehouseDto } from './dtos/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async findAll(): Promise<WarehouseBaseDto[]> {
    const warehouses = await this.prisma.warehouse.findMany();
    if (warehouses) return warehouses;
    return null;
  }
  // Get all assignable
  async getAssignable(locationId: string): Promise<WarehouseBaseDto[]> {
    const existLocation = await this.prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!existLocation) throw new LocationNotFoundException();
    const warehouses = await this.prisma.warehouse.findMany({
      where: {
        locationId: locationId,
      },
    });
    return warehouses;
  }
  // Create
  async createWarehouse(
    warehouseDto: CreateWarehouseDto,
  ): Promise<WarehouseBaseDto> {
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
        name: warehouseDto.name,
        slug: warehouseDto.slug,
        locationId: existLocation.id,
        comment: warehouseDto.comment || '',
      },
    });
    return warehouse;
  }
  // Get by ID
  async getWarehouse(id: string): Promise<WarehouseBaseDto> {
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
  async getWarehousesByUser(id: string): Promise<WarehouseBaseDto[]> {
    return await this.prisma.warehouse.findMany({});
  }
  // Update
  async updateWarehouse(
    id: string,
    warehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseBaseDto> {
    const existWarehouse = await this.prisma.warehouse.findUnique({
      where: { id: id },
    });
    if (!existWarehouse) throw new WarehouseNotFoundException();
    const updatedWarehouse = await this.prisma.warehouse.update({
      where: { id: id },
      data: {
        name: warehouseDto.name,
        slug: warehouseDto.slug,
        comment: warehouseDto.comment || undefined,
      },
    });
    return updatedWarehouse;
  }
}
