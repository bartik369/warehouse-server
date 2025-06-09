import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GrantRoleDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  roleId: string;
  
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  warehouseId?: string;

  @IsOptional()
  @Transform(({ value }) => value?.trim())
  locationId?: string
}
