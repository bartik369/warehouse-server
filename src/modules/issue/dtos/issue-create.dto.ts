import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateIssueDto {
  @Transform((item) => item.value?.trim())
  @IsNotEmpty()
  @IsString()
  processId: string;

  @IsArray()
  @ArrayNotEmpty()
  devices: string[];
}
