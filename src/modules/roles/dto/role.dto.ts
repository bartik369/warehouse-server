import { IsNotEmpty, IsString } from 'class-validator';

export class RoleDto {
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  comment: string;
}
