import { PartialType } from '@nestjs/mapped-types';
import { CreateIssueProcessDto } from './issue-process-create.dto';

export class UpdateIssueProcessDto extends PartialType(CreateIssueProcessDto) {}
