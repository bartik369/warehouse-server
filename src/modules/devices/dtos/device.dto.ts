import { IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class DeviceDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  inventoryNumber?: string;
  @IsOptional()
  @IsString()
  modelId?: string;
  @IsOptional()
  @IsString()
  modelCode?: string;
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
  inStock: boolean;
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
  contractorId: string;
  isAssigned: boolean;
  @IsString()
  warehouseId: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNotEmpty()
  @IsString()
  addedById: string;
  updatedById: string;
  lastIssuedAt: Date;
  lastReturnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  @IsOptional()
  @IsString()
  providerName?: string;
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
export class DeviceModelDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  slug: string;
  @IsNotEmpty()
  @IsString()
  imagePath: string;
  @IsNotEmpty()
  @IsString()
  manufacturerId: string;
  @IsNotEmpty()
  @IsString()
  typeId: string;
}
export class DeviceTypeDto {
  id: string;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  slug: string;
}

export type TDeviceDto = DeviceDto;
export type TDeviceModelDto = DeviceModelDto;
