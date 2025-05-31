import { CreateWarehouseDto } from './create-warehouse.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {}
