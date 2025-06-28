import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}
}
