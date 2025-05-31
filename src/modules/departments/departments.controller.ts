import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentBaseDto } from './dtos/department-base.dto';
import {
  departmentCreated,
  departmentUpdated,
} from 'src/common/utils/constants';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}
  // All
  @Get()
  async getDepartments(): Promise<DepartmentBaseDto[]> {
    return await this.departmentsService.getDepartments();
  }
  // Get by ID
  @Get(':id')
  async getDepartment(@Param('id') id: string): Promise<DepartmentBaseDto> {
    return await this.departmentsService.getDepartment(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDepartment(
    @Body() departmentDto: CreateDepartmentDto,
  ): Promise<{ message: string; department: DepartmentBaseDto }> {
    const department =
      await this.departmentsService.createDepartment(departmentDto);
    return {
      message: departmentCreated,
      department,
    };
  }
  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateDepartment(
    @Body() departmentDto: UpdateDepartmentDto,
    @Param('id') id: string,
  ): Promise<{ message: string; updatedDepartment: DepartmentBaseDto }> {
    const updatedDepartment = await this.departmentsService.updateDepartment(
      id,
      departmentDto,
    );
    return {
      message: departmentUpdated,
      updatedDepartment,
    };
  }
}
