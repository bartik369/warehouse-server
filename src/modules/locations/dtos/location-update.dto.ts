import { PartialType } from '@nestjs/mapped-types';

import { CreateLocationDto } from './location-create.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
