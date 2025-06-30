import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { IssueService } from './issues.service';
import { IssueBaseDto } from './dtos/issue-base.dto';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';
import { allowedPrintFileOptions } from 'src/common/utils/constants';

@Controller('issues')
export class IssueController {
  constructor(private issueService: IssueService) {}
  @Post()
  @FileUploadInterceptor(allowedPrintFileOptions)
  async createIssue(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: IssueBaseDto,
  ) {
    console.log(data)
    console.log(file);
    await new Promise((res) => setTimeout(res, 1500));
    return { success: true };
  }
}