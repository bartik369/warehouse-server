import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { roleCreated, roleDeleted, roleUpdated } from 'src/common/utils/constants';
import { CreateRoleDto } from './dto/create-role.dto';
import { GrantRoleDto } from './dto/grant-role.dto';
import { RoleBaseDto } from './dto/role-base.dto';
import { RolesListResponseDto } from './dto/roles-list-res.dto';
import { RolesListDto } from './dto/roles-list.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('users/:id')
  async getUserRoles(@Param('id', new ParseUUIDPipe()) id: string): Promise<RolesListResponseDto> {
    return this.rolesService.getUserRoles(id);
  }
  @Get()
  async getRoles(): Promise<RoleBaseDto[]> {
    return this.rolesService.getRoles();
  }

  @Get('list')
  async getRolesList(): Promise<RolesListDto[]> {
    return this.rolesService.getRolesList();
  }
  @Delete('users/:id')
  async revokeRole(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.rolesService.revokeUserRole(id);
  }
  @Get('assignable')
  async getAssignableRoles(): Promise<RoleBaseDto[]> {
    return this.rolesService.getAssignableRoles();
  }

  @Get(':id')
  async getRole(@Param('id', new ParseUUIDPipe()) id: string): Promise<RoleBaseDto> {
    return this.rolesService.getRole(id);
  }
  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async createRole(@Body() roleDto: CreateRoleDto): Promise<{
    message: string;
    role: RoleBaseDto;
  }> {
    const role = await this.rolesService.createRole(roleDto);

    return {
      message: roleCreated,
      role,
    };
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() roleDto: UpdateRoleDto,
  ): Promise<{
    message: string;
    updatedRole: RoleBaseDto;
  }> {
    const updatedRole = await this.rolesService.updateRole(id, roleDto);

    return {
      message: roleUpdated,
      updatedRole,
    };
  }

  @Delete(':id')
  async deleteRole(@Param('id', new ParseUUIDPipe()) id: string): Promise<{ message: string }> {
    await this.rolesService.deleteRole(id);

    return {
      message: roleDeleted,
    };
  }

  @Post('grant')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async grantUserRole(@Body() body: GrantRoleDto) {
    return this.rolesService.grantUserRoles(body);
  }
}
