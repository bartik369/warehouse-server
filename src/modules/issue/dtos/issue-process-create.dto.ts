import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIssueProcessDto {
  @Transform((item) => item.value.trim())
  @IsNotEmpty()
  @IsString()
  documentNo: string;

  @Transform((item) => item.value.trim())
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Transform((item) => item.value.trim())
  @IsNotEmpty()
  @IsString()
  warehouseId: string;

  @Transform((item) => item.value.trim())
  @IsNotEmpty()
  @IsString()
  issuedById: string;

  @Transform((item) => item.value.trim())
  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  file?: File;
}
