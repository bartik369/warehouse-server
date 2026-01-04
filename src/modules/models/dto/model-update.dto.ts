import { PartialType } from '@nestjs/mapped-types';

import { CreateModelDto } from './model-create.dto';

export class UpdateModelDto extends PartialType(CreateModelDto) {}
