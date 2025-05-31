import { CreateManufacturerDto } from './manufacturer-create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {}