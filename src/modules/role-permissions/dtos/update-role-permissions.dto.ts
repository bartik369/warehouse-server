import { CreateRolePermissionsDto } from './create-role-permissions.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRolePermissionsDto extends PartialType(
  CreateRolePermissionsDto,
) {}
