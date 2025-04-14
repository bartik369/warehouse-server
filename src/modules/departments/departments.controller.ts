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
import { DepartmentDto } from '../departments/dtos/department.dto';
import {
  departmentCreated,
  departmentUpdated,
} from 'src/common/utils/constants';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}
  // All
  @Get()
  async getDepartments(): Promise<DepartmentDto[]> {
    return await this.departmentsService.getDepartments();
  }
  // Get by ID
  @Get(':id')
  async getDepartment(@Param('id') id: string): Promise<DepartmentDto> {
    return await this.departmentsService.getDepartment(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDepartment(
    @Body() departmentDto: DepartmentDto,
  ): Promise<{ message: string; department: DepartmentDto }> {
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
    @Body() departmentDto: DepartmentDto,
    @Param('id') id: string,
  ): Promise<{ message: string; updatedDepartment: DepartmentDto }> {
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
