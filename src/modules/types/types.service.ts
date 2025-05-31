import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  TypeExistsException,
  TypeNotFoundException,
} from 'src/exceptions/device.exceptions';
import { CreateTypeDto } from './dto/create-type.dto';
import { TypeBaseDto } from './dto/type-base.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypesService {
  constructor(private prisma: PrismaService) {}
  async getTypes() {
    const types = await this.prisma.device_type.findMany({});
    return types;
  }
  // CREATE DEVICE TYPE
  async createType(typeDto: CreateTypeDto): Promise<TypeBaseDto> {
    const existingType = await this.prisma.device_type.findUnique({
      where: {
        name: typeDto.name,
        slug: typeDto.slug,
      },
    });
    if (existingType) throw new TypeExistsException();

    const type = await this.prisma.device_type.create({
      data: {
        name: typeDto.name,
        slug: typeDto.slug,
      },
    });
    return type;
  }
  // GET DEVICE TYPE BY ID
  async getType(id: string): Promise<TypeBaseDto> {
    const type = await this.prisma.device_type.findUnique({
      where: { id: id },
    });
    if (!type) throw new TypeNotFoundException();
    return type;
  }
  // UPDATE DEVICE TYPE
  async updateType(typeDto: UpdateTypeDto, id: string): Promise<TypeBaseDto> {
    const existType = await this.prisma.device_type.findUnique({
      where: { id: id },
    });
    if (!existType) throw new TypeNotFoundException();
    const updatedType = await this.prisma.device_type.update({
      where: { id: existType.id },
      data: {
        name: typeDto.name,
        slug: typeDto.slug,
      },
    });
    return updatedType;
  }
}
