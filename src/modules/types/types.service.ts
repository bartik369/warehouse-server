import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TypeExistsException } from 'src/exceptions/device.exceptions';
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
}
