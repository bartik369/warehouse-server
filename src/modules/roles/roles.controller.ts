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
import {
  roleCreated,
  roleDeleted,
  roleUpdated,
} from 'src/common/utils/constants';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleBaseDto } from './dto/role-base.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { RolesListDto } from './dto/roles-list.dto';
import { RolesListResponseDto } from './dto/roles-list-res.dto';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get('/users/:id')
  async getUserRoles(@Param('id') id: string): Promise<RolesListResponseDto> {
    return await this.rolesService.getUserRoles(id);
  }

  // Get all
  @Get()
  async getRoles(): Promise<RoleBaseDto[]> {
    return await this.rolesService.getRoles();
  }
  @Get('/list')
  async getRolesList(): Promise<RolesListDto[]> {
    return await this.rolesService.getRolesList();
  }
  // Get all for Assign
  @Get('assignable')
  async getAssignableRoles(): Promise<RoleBaseDto[]> {
    return await this.rolesService.getAssignableRoles();
  }

  // Get by ID
  @Get(':id')
  async getRole(@Param('id') id: string): Promise<RoleBaseDto> {
    return await this.rolesService.getRole(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRole(
    @Body() roleDto: CreateRoleDto,
  ): Promise<{ message: string; role: RoleBaseDto }> {
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
    @Body() roleDto: UpdateRoleDto,
  ): Promise<{ message: string; updatedRole: RoleBaseDto }> {
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
  @Post('/grant')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async grantUserRole(@Body() body: GrantRoleDto) {
    const splittedArgs = body.roleId.split('/');
    const userInfo = {
      userId: body.userId,
      roleId: splittedArgs[0],
      locationId: splittedArgs[1],
      warehouseId: splittedArgs[2] || null,
    };
    return await this.rolesService.grantUserRole(userInfo);
  }
}
