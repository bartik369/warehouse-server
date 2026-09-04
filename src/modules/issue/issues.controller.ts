import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { allowedPrintFileOptions } from 'src/common/utils/constants';
import { FinalizeIssueDto } from './dtos/finalize-issue.dto';
import { IssueProcessBaseDto } from './dtos/issue-process-base.dto';
import { CreateIssueProcessDto } from './dtos/issue-process-create.dto';
import { IssueProcessListItemDto } from './dtos/issue-process-list.dto';
import { IssueService } from './issues.service';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Post('finalize')
  @HttpCode(200)
  @FileUploadInterceptor(allowedPrintFileOptions)
  async finalizeIssue(@UploadedFile() file: Express.Multer.File, @Body() dto: FinalizeIssueDto) {
    const result = await this.issueService.finalizeIssue(dto, file);
    await new Promise((res) => setTimeout(res, 1500));
    return result;
  }

  @Post('process')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createIssueProcess(@Body() dto: CreateIssueProcessDto): Promise<IssueProcessBaseDto> {
    console.log('create issue process', dto);
    return await this.issueService.createIssueProcess(dto);
  }
  @Get('processes')
  async getIssueProcesses(): Promise<IssueProcessListItemDto[]> {
    return await this.issueService.getIssueProcesses();
  }

  @Get('process/by-device/:id')
  async getIssueProcessByDevice(@Param('id') id: string): Promise<any> {
    return await this.issueService.getIssueProcessByDevice(id);
  }

  @Get('process/:id')
  async getIssueProcess(@Param('id') id: string): Promise<any> {
    return await this.issueService.getIssueProcess(id);
  }

  @Delete('process/:id')
  async deleteIssueProcess(@Param('id') id: string): Promise<any> {
    return await this.issueService.deleteIssueProcess(id);
  }
  @Get('process/:id/file')
  async downloadIssueFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.issueService.getIssueFile(id);

    return res.download(file.fullPath, file.fileName);
  }
}
