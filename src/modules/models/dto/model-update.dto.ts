import { CreateModelDto } from './model-create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateModelDto extends PartialType(CreateModelDto) {}
