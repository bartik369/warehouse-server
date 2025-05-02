import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RolePermissionsDto {
  @IsOptional()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  roleId: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionId: string[];
  @IsOptional()
  @IsString()
  warehouseId: string;
  @IsNotEmpty()
  @IsString()
  locationId: string;
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class RolePermissionsResponseDto {
  id: string;
  roleId: string;
  permissionId: string[];
  permissionName: string[];
  locationId: string;
  locationName: string;
  warehouseId: string;
  warehouseName: string;
  comment: string;

  constructor(partial: Partial<RolePermissionsResponseDto>) {
    Object.assign(this, {
      id: '',
      permissionId: [],
      permissionName: [],
      locationId: '',
      locationName: '',
      warehouseId: '',
      warehouseName: '',
      comment: '',
      ...partial,
    });
  }
}
export class AllRolesPermissionsResDto {
  roleId: string;
  role: string;
  location: string;
  warehouse: string;
  permissions: string[];
}
