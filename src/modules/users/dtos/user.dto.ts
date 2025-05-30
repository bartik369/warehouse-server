import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  userName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  workId: string;
  @IsNotEmpty()
  @IsString()
  firstNameRu: string;
  @IsNotEmpty()
  @IsString()
  lastNameRu: string;
  @IsNotEmpty()
  @IsString()
  firstNameEn: string;
  @IsNotEmpty()
  @IsString()
  lastNameEn: string;
  isActive: boolean;
  @IsNotEmpty()
  @IsString()
  departmentId: string;
  @IsOptional()
  @IsString()
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  userName: string;
  email: string;
  workId: string;
  firstNameRu: string;
  lastNameRu: string;
  firstNameEn: string;
  lastNameEn: string;
  isActive: boolean;
  departmentId: string;
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

// export type User = UserDto;
