import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateDeviceDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  name: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  inventoryNumber?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  modelId?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  modelCode?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  screenSize?: number;

  @IsOptional()
  @IsNumber()
  memorySize?: number;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  inStock: boolean;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  isFunctional: boolean;

  @IsOptional()
  @IsNumber()
  price_with_vat: number;

  @IsOptional()
  @IsNumber()
  price_without_vat: number;

  @IsOptional()
  @IsNumber()
  residual_price: number;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  contractorId?: string;

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  isAssigned: boolean;

  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @IsString()
  warehouseId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  addedById: string;

  @IsNotEmpty()
  @IsString()
  updatedById: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  providerName?: string;

  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  warrantyNumber?: string;

  @IsOptional()
  @IsString()
  startWarrantyDate?: string;

  @IsOptional()
  @IsString()
  endWarrantyDate?: string;
}
