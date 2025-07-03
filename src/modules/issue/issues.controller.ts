import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IssueService } from './issues.service';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { allowedPrintFileOptions } from 'src/common/utils/constants';
import { CreateIssueProcessDto } from './dtos/issue-process-create.dto';
import { IssueProcessBaseDto } from './dtos/issue-process-base.dto';
import { CreateIssueDto } from './dtos/issue-create.dto';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Post('finalize')
  @HttpCode(200)
  @FileUploadInterceptor(allowedPrintFileOptions)
  async finalizeIssue(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: Pick<CreateIssueDto, 'processId'>,
  ) {
    const result = await this.issueService.finalizeIssue(dto, file);
    await new Promise((res) => setTimeout(res, 1500));
    return result;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createIssue(@Body() dto: CreateIssueDto) {
    console.log('create issue', dto);
    return await this.issueService.createIssue(dto);
  }

  @Post('process')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createIssueProcess(
    @Body() dto: CreateIssueProcessDto,
  ): Promise<IssueProcessBaseDto> {
    console.log('create issue process', dto);
    return await this.issueService.createIssueProcess(dto);
  }

  @Get('process/:id')
  async getIssueProcess() {}
}
