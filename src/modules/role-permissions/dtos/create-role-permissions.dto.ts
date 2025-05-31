import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRolePermissionsDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionIds?: string[] | null;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  oldWarehouseId?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  locationId?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  oldLocationId?: string;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
