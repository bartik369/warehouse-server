import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateIssueProcessDto } from './dtos/issue-process-create.dto';
import { IssueProcessBaseDto } from './dtos/issue-process-base.dto';
import { CreateIssueDto } from './dtos/issue-create.dto';
import { STATUS } from 'src/common/constants/status.constant';
import {
  ConflictIssueException,
  ConflictIssueProcessException,
  IssueProcessNotFoundException,
} from 'src/exceptions/issue.exceptions';
import { PATH } from 'src/common/constants/path.constants';
import { TYPES } from 'src/common/constants/types.constants';
import { savePdfFile } from 'src/common/utils/file/file.util';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  async createIssueProcess(
    dto: CreateIssueProcessDto,
  ): Promise<IssueProcessBaseDto> {
    const existingProcess = await this.prisma.device_issue_process.findUnique({
      where: {
        documentNo: dto.documentNo,
        userId: dto.userId,
        issuedById: dto.issuedById,
      },
    });
    if (existingProcess) throw new ConflictIssueProcessException();
    const newProcess = await this.prisma.device_issue_process.create({
      data: {
        documentNo: dto.documentNo,
        userId: dto.userId,
        warehouseId: dto.warehouseId,
        issuedById: dto.issuedById,
        status: dto.status,
      },
      include: {
        user: true,
        issuedBy: true,
        warehouse: true,
        file: true,
      },
    });
    return {
      id: newProcess.id,
      documentNo: newProcess.documentNo,
      userId: newProcess.user.id,
      recipientFirstName: newProcess.user.firstNameRu,
      recipientLastName: newProcess.user.lastNameRu,
      warehouseId: newProcess.warehouseId,
      warehouseName: newProcess.warehouse.name,
      issuedById: newProcess.issuedById,
      initiatorFirstName: newProcess.issuedBy.firstNameRu,
      initiatorLastName: newProcess.issuedBy.lastNameRu,
      issueDate: newProcess.issueDate,
      comment: newProcess.comment ?? '',
      status: newProcess.status,
      fileId: newProcess.fileId ?? '',
      fileName: newProcess.file?.fileName ?? '',
      filePath: newProcess.file?.filePath ?? '',
      createdAt: newProcess.createdAt,
      updatedAt: newProcess.updatedAt,
    };
  }

  async createIssue(dto: CreateIssueDto) {
    const existingProcess = await this.prisma.device_issue_process.findUnique({
      where: { documentNo: dto.processId },
    });
    if (!existingProcess) throw new IssueProcessNotFoundException();

    const existingIssue = await this.prisma.device_issue.findMany({
      where: { processId: existingProcess.id },
    });
    if (existingIssue.length > 0) throw new ConflictIssueException();

    const issueData = dto.devices.map((deviceId) => ({
      processId: existingProcess.id,
      deviceId,
    }));

    await this.prisma.device_issue.createMany({
      data: issueData,
      skipDuplicates: true,
    });

    await this.prisma.device_issue_process.update({
      where: { id: existingProcess.id },
      data: { status: STATUS.sign_document },
    });
  }

  async finalizeIssue(
    dto: Pick<CreateIssueDto, 'processId'>,
    file: Express.Multer.File,
  ) {
    if (!file) throw new ConflictIssueException();
    const existingProcess = await this.prisma.device_issue_process.findUnique({
      where: { documentNo: dto.processId },
    });
    if (!existingProcess) throw new IssueProcessNotFoundException();
    const newFileRecord = await this.prisma.file.create({
      data: {
        fileName: file.originalname,
        filePath: PATH.upload_issue,
        fileType: TYPES.pdf,
        size: file.size,
      },
    });
    await savePdfFile(PATH.upload_issue, file);
    const finishProcess = await this.prisma.device_issue_process.update({
      where: { id: existingProcess.id },
      data: {
        fileId: newFileRecord.id,
        status: STATUS.signed,
      },
    });
    return finishProcess;
  }
}
