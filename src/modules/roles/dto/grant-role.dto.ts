import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class GrantRoleDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUUID()
  userId: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUUID()
  roleId: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : undefined))
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : undefined))
  @IsUUID()
  locationId?: string;
}
