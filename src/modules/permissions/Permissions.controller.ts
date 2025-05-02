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
import {
  permissionCreated,
  permissionDeleted,
  permissionUpdated,
} from 'src/common/utils/constants';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}
  // Get all
  @Get()
  async getPermissions(): Promise<PermissionDto[]> {
    return await this.permissionsService.getPermissions();
  }
  // Get by ID
  @Get(':id')
  async getPermission(@Param('id') id: string): Promise<PermissionDto> {
    return await this.permissionsService.getPermission(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createPermission(
    @Body() permissionDto: PermissionDto,
  ): Promise<{ message: string; permission: PermissionDto }> {
    const permission =
      await this.permissionsService.createPermission(permissionDto);
    return {
      message: permissionCreated,
      permission,
    };
  }
  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePermission(
    @Param('id') id: string,
    @Body() permissionDto: PermissionDto,
  ): Promise<{ message: string; updatedPermission: PermissionDto }> {
    const updatedPermission = await this.permissionsService.updatePermission(
      id,
      permissionDto,
    );
    return {
      message: permissionUpdated,
      updatedPermission,
    };
  }

  // Delete
  @Delete(':id')
  async deletePermission(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.permissionsService.deletePermission(id);
    return {
      message: permissionDeleted,
    };
  }
}
