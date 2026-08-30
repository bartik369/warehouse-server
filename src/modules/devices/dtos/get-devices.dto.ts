import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

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

const toBoolean = ({ value }: { value: unknown }): boolean => {
  return value === true || value === 'true';
};

const toNumberRange = ({ value }: { value: unknown }): [number, number] => {
  const values = Array.isArray(value) ? value : String(value).split(',');

  return [Number(values[0]), Number(values[1])];
};

export class GetDevicesQueryDto {
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
  @IsUUID('4', { each: true })
  warehouseIds?: string[];

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsUUID('4', { each: true })
  manufacturerIds?: string[];

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsUUID('4', { each: true })
  typeIds?: string[];

  @IsOptional()
  @Transform(toNumberRange)
  @IsArray()
  @IsNumber({}, { each: true })
  displaySize?: [number, number];

  @IsOptional()
  @Transform(toNumberRange)
  @IsArray()
  @IsNumber({}, { each: true })
  memorySize?: [number, number];

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isFunctional?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isAvailable?: boolean;
}
