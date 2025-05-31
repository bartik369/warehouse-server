import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsBaseDto } from './dtos/role-permissions-base.dto';
import { CreateRolePermissionsDto } from './dtos/create-role-permissions.dto';
import {
  createdRolePermissions,
  updatedRolePermissions,
} from 'src/common/utils/constants';

@Controller('permissions-roles')
export class RolePermissionsController {
  constructor(private rolePermissionsService: RolePermissionsService) {}
  //Get all
  @Get('')
  async getRolePermissions(): Promise<RolePermissionsBaseDto[]> {
    return await this.rolePermissionsService.getAllRolesPermissions();
  }
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRolePermissions(
    @Body() rolePermissionsDto: CreateRolePermissionsDto,
  ): Promise<{ message: string }> {
    await this.rolePermissionsService.createUpdateRolePermissions(
      rolePermissionsDto,
    );
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
    await this.rolePermissionsService.createUpdateRolePermissions(
      rolePermissionsDto,
    );
    return {
      message: updatedRolePermissions,
    };
  }
}
