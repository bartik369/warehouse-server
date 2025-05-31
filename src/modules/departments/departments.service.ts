import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DepartmentBaseDto } from './dtos/department-base.dto';
import {
  DepartmentExistException,
  DepartmentNotFoundException,
} from 'src/exceptions/location.exceptions';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}
  // All
  async getDepartments(): Promise<DepartmentBaseDto[]> {
    const departments = await this.prisma.department.findMany({});
    if (!departments) throw new DepartmentNotFoundException();
    return departments;
  }
  // Get by ID
  async getDepartment(id: string): Promise<DepartmentBaseDto> {
    const department = await this.prisma.department.findUnique({
      where: { id: id },
    });
    if (!department) throw new DepartmentNotFoundException();
    return department;
  }
  // Create
  async createDepartment(
    departmentDto: CreateDepartmentDto,
  ): Promise<DepartmentBaseDto> {
    const existDepartment = await this.prisma.department.findUnique({
      where: {
        name: departmentDto.name,
      },
    });
    if (existDepartment) throw new DepartmentExistException();
    const department = await this.prisma.department.create({
      data: {
        name: departmentDto.name,
        slug: departmentDto.slug,
        comment: departmentDto.comment || '',
      },
    });
    return department;
  }
  // Update
  async updateDepartment(
    id: string,
    departmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentBaseDto> {
    const existDepartment = await this.prisma.department.findUnique({
      where: { id: id },
    });
    if (!existDepartment) throw new DepartmentNotFoundException();

    const updatedDepartment = await this.prisma.department.update({
      where: { id: existDepartment.id },
      data: {
        name: departmentDto.name,
        slug: departmentDto.slug,
        comment: departmentDto.comment || undefined,
      },
    });
    return updatedDepartment;
  }
}
