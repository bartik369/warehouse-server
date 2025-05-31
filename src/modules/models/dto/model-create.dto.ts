import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateModelDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  slug: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  imagePath?: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  typeId: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  manufacturerId: string;
}
