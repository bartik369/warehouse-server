import { IsNumber, IsString, IsOptional } from 'class-validator';

export class DeviceDto {
  id: string;
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
  price_with_vat: number;
  price_without_vat: number;
  residual_price: number;
  contractorId: string;
  isAssigned: boolean;
  warehouseId: string;
  @IsOptional()
  @IsString()
  description?: string;
  addedById: string;
  updatedById: string;
  lastIssuedAt: Date;
  lastReturnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  @IsOptional()
  @IsString()
  provider?: string;
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
  name: string;
  slug: string;
  imagePath: string;
  manufacturerId: string;
  typeId: string;
}

export type TDeviceDto = DeviceDto;
export type TDeviceModelDto = DeviceModelDto;
