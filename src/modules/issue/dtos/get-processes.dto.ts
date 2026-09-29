import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ProcessStatus } from '../types';

const toArray = ({ value }: { value: unknown }): string[] => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export class GetProcessesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  warehousesSlugs?: string[];

  @IsOptional()
  @IsString()
  companyPersonId?: string;

  @IsOptional()
  @IsString()
  employeePersonId?: string;

  @IsOptional()
  @IsString()
  status?: ProcessStatus;

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  dateRange?: [string, string];

  @IsOptional()
  @IsString()
  search?: string;
}
