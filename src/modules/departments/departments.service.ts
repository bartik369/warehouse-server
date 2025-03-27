import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DepartmentDto } from './dtos/department.dto';
import {
  DepartmentExistException,
  DepartmentNotFoundException,
} from 'src/exceptions/location.exceptions';
import { ILocation } from 'src/common/types/location.types';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async getDepartments(): Promise<ILocation[]> {
    const departments = await this.prisma.department.findMany({});
    return departments;
  }
  async getDepartment(id: string): Promise<ILocation> {
    const department = await this.prisma.department.findUnique({
      where: { id: id },
    });
    if (!department) return null;
    return department;
  }
  async createDepartment(departmentDto: DepartmentDto): Promise<ILocation> {
    const existDepartment = await this.prisma.department.findUnique({
      where: {
        name: departmentDto.name.trim(),
      },
    });
    if (existDepartment) throw new DepartmentExistException();
    const department = await this.prisma.department.create({
      data: {
        name: departmentDto.name.trim(),
        slug: departmentDto.slug.trim(),
        comment: departmentDto.comment,
      },
    });
    return department;
  }
  async updateDepartment(id: string, departmentDto: DepartmentDto) {
    const existDepartment = await this.prisma.department.findUnique({
      where: { id: id },
    });
    if (!existDepartment) throw new DepartmentNotFoundException();
    const updatedDepartment = await this.prisma.department.update({
      where: { id: existDepartment.id },
      data: {
        name: departmentDto.name?.trim() || undefined,
        slug: departmentDto.slug?.trim() || undefined,
        comment: departmentDto.comment || undefined,
      },
    });
    return updatedDepartment;
  }
}
