import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class FinalizeIssueDto {
  @IsUUID()
  processId: string;

  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }

    return value ? [value] : [];
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  deviceIds: string[];
}
