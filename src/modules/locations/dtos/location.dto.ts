import { IsNotEmpty, IsString } from 'class-validator';

export class LocationDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  slug: string;
  comment: string;
}
export class DepartmentDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  slug: string;
  @IsString()
  comment: string;
}
