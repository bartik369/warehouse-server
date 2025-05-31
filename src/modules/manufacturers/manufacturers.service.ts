import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  ManufacturerExistsException,
  ManufacturerNotFoundException,
} from 'src/exceptions/device.exceptions';
import { ManufacturerBaseDto } from './dto/manufacturer-base.dto';
import { UpdateManufacturerDto } from './dto/manufacturer-update.dto';
import { CreateManufacturerDto } from './dto/manufacturer-create.dto';

@Injectable()
export class ManufacturersService {
  constructor(private prisma: PrismaService) {}
  // Get All
  async getManufacturers(): Promise<ManufacturerBaseDto[]> {
    const manufacturers = await this.prisma.manufacturer.findMany();
    return manufacturers;
  }
  // Get by ID
  async getManufacturer(id: string): Promise<ManufacturerBaseDto> {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: id },
    });
    if (!manufacturer) throw new ManufacturerNotFoundException();
    return manufacturer;
  }
  // Update
  async updateManufacturer(
    id: string,
    manufacturerDto: UpdateManufacturerDto,
  ): Promise<ManufacturerBaseDto> {
    const existManufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: id },
    });
    if (!existManufacturer) throw new ManufacturerNotFoundException();
    const updatedManufacturer = await this.prisma.manufacturer.update({
      where: { id: id },
      data: {
        name: manufacturerDto.name,
        slug: manufacturerDto.slug,
        comment: manufacturerDto.comment || undefined,
      },
    });
    return updatedManufacturer;
  }
  // Create
  async createManufacturer(
    manufacturerDto: CreateManufacturerDto,
  ): Promise<ManufacturerBaseDto> {
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
        comment: manufacturerDto.comment || '',
      },
    });
    return manufacturer;
  }
}
