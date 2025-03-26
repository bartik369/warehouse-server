import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModelDto {
  @IsOptional()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  slug: string;
  @IsOptional()
  imagePath?: string;
  @IsString()
  @IsNotEmpty()
  typeId: string;
  @IsString()
  @IsNotEmpty()
  manufacturerId: string;
}
