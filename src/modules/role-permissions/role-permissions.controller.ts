import { Body, Controller, Get, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { createdRolePermissions, updatedRolePermissions } from 'src/common/utils/constants';
import { CreateRolePermissionsDto } from './dtos/create-role-permissions.dto';
import { GetRolePermissionsQueryDto } from './dtos/get-role-permissions.dto';
import { RolePermissionsBaseDto, SortedRolePermissionsDto } from './dtos/role-permissions-base.dto';
import { RolePermissionsService } from './role-permissions.service';

@Controller('permissions-roles')
export class RolePermissionsController {
  constructor(private rolePermissionsService: RolePermissionsService) {}
  //Get all
  @Get('')
  async getRolePermissions(
    @Query() query: GetRolePermissionsQueryDto,
  ): Promise<SortedRolePermissionsDto> {
    return await this.rolePermissionsService.getAllRolesPermissions(query);
  }

  @Get('options')
  async getRolePermissionsOptions(): Promise<RolePermissionsBaseDto[]> {
    return await this.rolePermissionsService.getRolesPermissionsOptions();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRolePermissions(
    @Body() rolePermissionsDto: CreateRolePermissionsDto,
  ): Promise<{ message: string }> {
    await this.rolePermissionsService.createUpdateRolePermissions(rolePermissionsDto);
    return {
      message: createdRolePermissions,
    };
  }
  // Update
  @Put()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateRolePermissions(
    @Body() rolePermissionsDto: CreateRolePermissionsDto,
  ): Promise<{ message: string }> {
    await this.rolePermissionsService.createUpdateRolePermissions(rolePermissionsDto);
    return {
      message: updatedRolePermissions,
    };
  }
}
