import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TypeDto {
  @IsOptional()
  id?: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  slug: string;
}
