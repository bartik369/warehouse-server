import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { IssueController } from './issues.controller';
import { IssueService } from './issues.service';

@Module({
  imports: [PrismaModule],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
