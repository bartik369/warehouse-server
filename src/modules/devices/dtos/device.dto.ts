import { IsString, IsNotEmpty } from 'class-validator';
import { DeviceBaseDto } from './device-base.dto';

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

export type TDeviceDto = DeviceBaseDto;
export type TDeviceModelDto = DeviceModelDto;
