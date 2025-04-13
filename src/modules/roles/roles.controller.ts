import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  ValidationPipe,
  UsePipes,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import { roleCreated, roleUpdated } from 'src/common/utils/constants';
import { FormDataRequest } from 'nestjs-form-data';
// import { FormDataOnlyInterceptor } from 'src/common/interceptors/form-data.interceptor';

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}
  // GET ALL
  @Get()
  async getRoles() {
    return await this.rolesService.getRoles();
  }
  // GET BY ID
  @Get(':id')
  @FormDataRequest()
  async getRole(@Param('id') id: string) {
    return await this.rolesService.getRole(id);
  }
  // CREATE
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @FormDataRequest()
  @HttpCode(HttpStatus.OK)
  async createRole(@Body() roleDto: RoleDto) {
    const role = await this.rolesService.createRole(roleDto);
    if (role) {
      return {
        message: roleCreated,
        role,
      };
    }
  }
  // UPDATE
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))

  @HttpCode(HttpStatus.OK)
  async updateRole(@Param('id') id: string, @Body() roleDto: RoleDto) {
    const updatedRole = await this.rolesService.updateRole(id, roleDto);
    if (updatedRole) {
      return {
        message: roleUpdated,
        updatedRole,
      };
    }
  }
  //DELETE
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    console.log(id);
  }
}
