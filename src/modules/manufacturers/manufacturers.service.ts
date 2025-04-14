import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ManufacturerDto } from './dto/manufacturer.dto';
import {
  ManufacturerExistsException,
  ManufacturerNotFoundException,
} from 'src/exceptions/device.exceptions';

@Injectable()
export class ManufacturersService {
  constructor(private prisma: PrismaService) {}
  // Get All
  async getManufacturers(): Promise<ManufacturerDto[]> {
    const manufacturers = await this.prisma.manufacturer.findMany();
    return manufacturers;
  }
  // Get by ID
  async getManufacturer(id: string): Promise<ManufacturerDto> {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: id },
    });
    if (!manufacturer) throw new ManufacturerNotFoundException();
    return manufacturer;
  }
  // Update
  async updateManufacturer(
    id: string,
    manufacturerDto: ManufacturerDto,
  ): Promise<ManufacturerDto> {
    const existManufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: id },
    });
    if (!existManufacturer) throw new ManufacturerNotFoundException();
    const updatedManufacturer = await this.prisma.manufacturer.update({
      where: { id: id },
      data: {
        name: manufacturerDto.name?.trim(),
        slug: manufacturerDto.slug?.trim(),
        comment: manufacturerDto.comment || undefined,
      },
    });
    return updatedManufacturer;
  }
  // Create
  async createManufacturer(
    manufacturerDto: ManufacturerDto,
  ): Promise<ManufacturerDto> {
    const existingManufacturer = await this.prisma.manufacturer.findFirst({
      where: {
        name: manufacturerDto.name?.trim(),
        slug: manufacturerDto.slug?.trim(),
      },
    });
    if (existingManufacturer) throw new ManufacturerExistsException();

    const manufacturer = await this.prisma.manufacturer.create({
      data: {
        name: manufacturerDto.name?.trim(),
        slug: manufacturerDto.slug?.trim(),
        comment: manufacturerDto.comment || undefined,
      },
    });
    return manufacturer;
  }
}
