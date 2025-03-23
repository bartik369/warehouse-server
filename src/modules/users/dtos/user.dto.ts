import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  userName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
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
  department: string;
  @IsNotEmpty()
  @IsString()
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type User = UserDto;
