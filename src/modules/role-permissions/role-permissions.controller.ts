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
import { RolePermissionsDto } from './dtos/role-permissions.dto';

@Controller('permissions-roles')
export class RolePermissionsController {
  constructor(private rolePermissionsService: RolePermissionsService) {}
  //Get all
  @Get('')
  async getRolePermissions() {
    return await this.rolePermissionsService.getAllRolesPermissions();
  }
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRolePermissions(
    @Body() rolePermissionsDto: RolePermissionsDto,
  ): Promise<{ message: string }> {
    await this.rolePermissionsService.createUpdateRolePermissions(
      rolePermissionsDto,
    );
    return {
      message: 'ewew',
    };
  }
  // Update
  @Put()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateRolePermissions(@Body() rolePermissionsDto: RolePermissionsDto) {
    await this.rolePermissionsService.createUpdateRolePermissions(
      rolePermissionsDto,
    );
    return {
      message: 'ewew',
    };
  }
}
