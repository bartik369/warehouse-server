import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PATH } from 'src/common/constants/path.constants';
import { TYPES } from 'src/common/constants/types.constants';
import { savePdfFile } from 'src/common/utils/file/file.util';
import {
  ConflictIssueException,
  ConflictIssueProcessException,
  IssueProcessNotFoundException,
} from 'src/exceptions/issue.exceptions';
import { STATUS } from '../types/types';
import { FinalizeIssueDto } from './dtos/finalize-issue.dto';
import { IssueProcessBaseDto } from './dtos/issue-process-base.dto';
import { CreateIssueProcessDto } from './dtos/issue-process-create.dto';
import { IssueProcessListItemDto } from './dtos/issue-process-list.dto';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  async createIssueProcess(dto: CreateIssueProcessDto): Promise<IssueProcessBaseDto> {
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

  async getIssueProcess(id: string) {
    const process = await this.prisma.device_issue_process.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        issuedBy: true,
        warehouse: true,
      },
    });

    if (!process) {
      throw new IssueProcessNotFoundException();
    }

    return process;
  }

  async getIssueProcesses(): Promise<IssueProcessListItemDto[]> {
    return this.prisma.device_issue_process.findMany({
      select: {
        id: true,
        documentNo: true,
        status: true,
        issueDate: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstNameRu: true,
            lastNameRu: true,

            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,

            location: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        issuedBy: {
          select: {
            id: true,
            firstNameRu: true,
            lastNameRu: true,
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // async createIssue(dto: CreateIssueDto) {
  //   const existingProcess = await this.prisma.device_issue_process.findUnique({
  //     where: { documentNo: dto.processId },
  //   });
  //   if (!existingProcess) throw new IssueProcessNotFoundException();

  //   const existingIssue = await this.prisma.device_issue.findMany({
  //     where: { processId: existingProcess.id },
  //   });
  //   if (existingIssue.length > 0) throw new ConflictIssueException();

  //   const issueData = dto.devices.map((deviceId) => ({
  //     processId: existingProcess.id,
  //     deviceId,
  //   }));

  //   await this.prisma.device_issue.createMany({
  //     data: issueData,
  //     skipDuplicates: true,
  //   });

  //   await this.prisma.device_issue_process.update({
  //     where: { id: existingProcess.id },
  //     data: { status: STATUS.sign_document },
  //   });
  // }

  async finalizeIssue(dto: FinalizeIssueDto, file: Express.Multer.File) {
    if (!file) {
      throw new ConflictIssueException();
    }

    const deviceIds = [...new Set(dto.deviceIds)];
    const process = await this.prisma.device_issue_process.findUnique({
      where: {
        id: dto.processId,
      },
      select: {
        id: true,
        userId: true,
        warehouseId: true,
        status: true,
        fileId: true,
      },
    });

    if (!process) {
      throw new IssueProcessNotFoundException();
    }

    if (process.status !== STATUS.draft) {
      throw new ConflictIssueProcessException();
    }

    if (process.fileId) {
      throw new ConflictIssueProcessException();
    }

    const devices = await this.prisma.device.findMany({
      where: {
        id: {
          in: deviceIds,
        },
      },
      select: {
        id: true,
        warehouseId: true,
        inStock: true,
        isAssigned: true,
        assignedUserId: true,
      },
    });

    if (devices.length !== deviceIds.length) {
      throw new ConflictIssueException();
    }

    const invalidDevice = devices.find(
      (device) =>
        device.isAssigned ||
        device.assignedUserId !== null ||
        !device.inStock ||
        device.warehouseId !== process.warehouseId,
    );

    if (invalidDevice) {
      throw new ConflictIssueException();
    }

    await savePdfFile(PATH.upload_issue, file);

    const issuedAt = new Date();

    return this.prisma.$transaction(async (tx) => {
      const fileRecord = await tx.file.create({
        data: {
          fileName: file.originalname,
          filePath: PATH.upload_issue,
          fileType: TYPES.pdf,
          size: file.size,
        },
      });

      await tx.device_issue.createMany({
        data: deviceIds.map((deviceId) => ({
          processId: process.id,
          deviceId,
        })),
      });

      await tx.device.updateMany({
        where: {
          id: {
            in: deviceIds,
          },
        },
        data: {
          isAssigned: true,
          inStock: false,
          assignedUserId: process.userId,
          lastIssuedAt: issuedAt,
        },
      });

      const completedProcess = await tx.device_issue_process.update({
        where: {
          id: process.id,
        },
        data: {
          status: STATUS.completed,
          issueDate: issuedAt,
          fileId: fileRecord.id,
        },
        include: {
          user: {
            select: {
              id: true,
              firstNameRu: true,
              lastNameRu: true,
              email: true,
            },
          },
          issuedBy: {
            select: {
              id: true,
              firstNameRu: true,
              lastNameRu: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          file: true,
          deviceIssues: {
            include: {
              device: true,
            },
          },
        },
      });

      return completedProcess;
    });
  }
}
