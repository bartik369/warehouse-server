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
  // GET DEVICE MANUFACTURERS
  async getManufacturers() {
    const manufacturers = await this.prisma.manufacturer.findMany();
    return manufacturers;
  }
  // GET MANUFACTURER
  async getManufacturer(id: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: id },
    });
    if (!manufacturer) return null;
    return manufacturer;
  }
  // UPDATE MANUFACTURER
  async updateManufacturer(id: string, manufacturerDto: ManufacturerDto) {
    const existManufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: id },
    });
    if (!existManufacturer) throw new ManufacturerNotFoundException();
    const updatedManufacturer = await this.prisma.manufacturer.update({
      where: { id: id },
      data: {
        name: manufacturerDto.name?.trim() || undefined,
        slug: manufacturerDto.slug?.trim() || undefined,
        comment: manufacturerDto.comment || undefined,
      },
    });
    return updatedManufacturer;
  }
  //CREATE DEVICE MANUFACTURER
  async createManufacturer(manufacturerDto: ManufacturerDto) {
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
}
