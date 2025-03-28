import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentDto } from '../locations/dtos/location.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}
  @Get()
  async getDepartments() {
    return await this.departmentsService.getDepartments();
  }
  @Get(':id')
  async getDepartment(@Param('id') id: string) {
    return await this.departmentsService.getDepartment(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createDepartment(@Body() departmentDto: DepartmentDto) {
    return this.departmentsService.createDepartment(departmentDto);
  }
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateDepartment(
    @Body() departmentDto: DepartmentDto,
    @Param('id') id: string,
  ) {
    return await this.departmentsService.updateDepartment(id, departmentDto);
  }
}
