import { CreateLocationDto } from './location-create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
