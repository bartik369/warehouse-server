import { PartialType } from '@nestjs/mapped-types';

import { CreateManufacturerDto } from './manufacturer-create.dto';

export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {}
