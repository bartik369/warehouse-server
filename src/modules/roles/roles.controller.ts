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
import { IRole } from './types/role.types';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  // Get all
  @Get()
  async getRoles(): Promise<IRole[]> {
    return await this.rolesService.getRoles();
  }
  // Get all for Assign
  @Get('assignable')
  async getAssignableRoles(): Promise<IRole[]> {
    return await this.rolesService.getAssignableRoles();
  }

  // Get by ID
  @Get(':id')
  async getRole(@Param('id') id: string): Promise<IRole> {
    return await this.rolesService.getRole(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRole(
    @Body() roleDto: RoleDto,
  ): Promise<{ message: string; role: IRole }> {
    const role = await this.rolesService.createRole(roleDto);
    return {
      message: roleCreated,
      role,
    };
  }
  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateRole(
    @Param('id') id: string,
    @Body() roleDto: RoleDto,
  ): Promise<{ message: string; updatedRole: IRole }> {
    const updatedRole = await this.rolesService.updateRole(id, roleDto);
    return {
      message: roleUpdated,
      updatedRole,
    };
  }
  // Delete
  @Delete(':id')
  async deleteRole(@Param('id') id: string): Promise<{ message: string }> {
    await this.rolesService.deleteRole(id);
    return {
      message: roleDeleted,
    };
  }
}
