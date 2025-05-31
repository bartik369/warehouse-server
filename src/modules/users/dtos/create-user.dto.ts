import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  workId?: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  firstNameRu: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  lastNameRu: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  firstNameEn: string;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  lastNameEn: string;

  @Type(() => Boolean)
  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  locationId?: string;
}