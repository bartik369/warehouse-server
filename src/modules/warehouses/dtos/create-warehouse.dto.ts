import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWarehouseDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  locationId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  locationName?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
