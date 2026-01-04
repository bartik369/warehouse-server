import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
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
