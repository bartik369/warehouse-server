import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateManufacturerDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  comment?: string;
}