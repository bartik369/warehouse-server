import { IsNotEmpty, IsString } from 'class-validator';

export class ContractorDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  slug: string;
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @IsString()
  address: string;
}
