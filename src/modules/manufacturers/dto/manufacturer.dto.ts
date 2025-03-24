import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ManufacturerDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  comment?: string;
}