import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import {
  roleCreated,
  roleDeleted,
  roleUpdated,
} from 'src/common/utils/constants';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  // Get all
  @Get()
  async getRoles(): Promise<RoleDto[]> {
    return await this.rolesService.getRoles();
  }
  // Get by ID
  @Get(':id')
  async getRole(@Param('id') id: string): Promise<RoleDto> {
    return await this.rolesService.getRole(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRole(
    @Body() roleDto: RoleDto,
  ): Promise<{ message: string; role: RoleDto }> {
    const role = await this.rolesService.createRole(roleDto);
    return {
      message: roleCreated,
      role,
    };
  }
  // Update
  @Put()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateRole(
    @Param('id') id: string,
    roleDto: RoleDto,
  ): Promise<{ message: string; updatedRole: RoleDto }> {
    const updatedRole = await this.rolesService.updateRole(id, roleDto);
    return {
      message: roleUpdated,
      updatedRole,
    };
  }
  // Delete
  @Delete()
  async deleteRole(@Param('id') id: string): Promise<{ message: string }> {
    await this.rolesService.deleteRole(id);
    return {
      message: roleDeleted,
    };
  }
}
