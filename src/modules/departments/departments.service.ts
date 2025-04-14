import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DepartmentDto } from './dtos/department.dto';
import {
  DepartmentExistException,
  DepartmentNotFoundException,
} from 'src/exceptions/location.exceptions';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}
  // All
  async getDepartments(): Promise<DepartmentDto[]> {
    const departments = await this.prisma.department.findMany({});
    if (!departments) throw new DepartmentNotFoundException();
    return departments;
  }
  // Get by ID
  async getDepartment(id: string): Promise<DepartmentDto> {
    const department = await this.prisma.department.findUnique({
      where: { id: id },
    });
    if (!department) throw new DepartmentNotFoundException();
    return department;
  }
  // Create
  async createDepartment(departmentDto: DepartmentDto): Promise<DepartmentDto> {
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
        comment: departmentDto.comment || undefined,
      },
    });
    return department;
  }
  // Update
  async updateDepartment(
    id: string,
    departmentDto: DepartmentDto,
  ): Promise<DepartmentDto> {
    const existDepartment = await this.prisma.department.findUnique({
      where: { id: id },
    });
    if (!existDepartment) throw new DepartmentNotFoundException();

    const updatedDepartment = await this.prisma.department.update({
      where: { id: existDepartment.id },
      data: {
        name: departmentDto.name?.trim(),
        slug: departmentDto.slug?.trim(),
        comment: departmentDto.comment || undefined,
      },
    });
    return updatedDepartment;
  }
}
