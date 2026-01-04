import { PartialType } from '@nestjs/mapped-types';

import { CreateRolePermissionsDto } from './create-role-permissions.dto';

export class UpdateRolePermissionsDto extends PartialType(CreateRolePermissionsDto) {}
