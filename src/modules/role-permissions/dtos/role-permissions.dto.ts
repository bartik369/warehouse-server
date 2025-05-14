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
  permissionIds: string[] | null;
  @IsNotEmpty()
  @IsString()
  roleName: string;
  @IsOptional()
  @IsString()
  warehouseId: string | null;
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
  permissionIds: string[];
  permissionName: string[];
  locationId: string;
  locationName: string;
  warehouseId: string;
  warehouseName: string;
  comment: string;

  constructor(partial: Partial<RolePermissionsResponseDto>) {
    Object.assign(this, {
      id: '',
      permissionIds: [],
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
