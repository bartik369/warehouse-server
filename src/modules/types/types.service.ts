import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  TypeExistsException,
  TypeNotFoundException,
} from 'src/exceptions/device.exceptions';
import { TypeDto } from './dto/type.dto';

@Injectable()
export class TypesService {
  constructor(private prisma: PrismaService) {}
  async getTypes() {
    const types = await this.prisma.device_type.findMany({});
    return types;
  }
  // CREATE DEVICE TYPE
  async createType(typeDto: TypeDto) {
    const existingType = await this.prisma.device_type.findUnique({
      where: {
        name: typeDto.name?.trim(),
        slug: typeDto.slug?.trim(),
      },
    });
    if (existingType) throw new TypeExistsException();

    const type = await this.prisma.device_type.create({
      data: {
        name: typeDto.name?.trim(),
        slug: typeDto.slug?.trim(),
      },
    });
    return type;
  }
  // GET DEVICE TYPE BY ID
  async getType(id: string) {
    const type = await this.prisma.device_type.findUnique({
      where: { id: id },
    });
    if (!type) throw new TypeNotFoundException();
    return type;
  }
  // UPDATE DEVICE TYPE
  async updateType(typeDto: TypeDto, id: string) {
    const existType = await this.prisma.device_type.findUnique({
      where: { id: id },
    });
    if (!existType) throw new TypeNotFoundException();
    const updatedType = await this.prisma.device_type.update({
      where: { id: existType.id },
      data: {
        name: typeDto.name?.trim() || undefined,
        slug: typeDto.slug?.trim() || undefined,
      },
    });
    return updatedType;
  }
}
