import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  comment: string;
}
