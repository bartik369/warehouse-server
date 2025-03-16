import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ContractorDto } from './dtos/contactor.dto';
import { contractorAlreadyExists } from 'src/common/utils/constants';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}
  async getContractors() {
    return this.prisma.contractor.findMany({});
  }
  async createContractor(contractorDto: ContractorDto) {
    const existContractor = await this.prisma.contractor.findUnique({
      where: {
        name: contractorDto.name.trim(),
      },
    });
    if (existContractor) return contractorAlreadyExists;
    const contractor = await this.prisma.contractor.create({
      data: {
        name: contractorDto.name,
        phoneNumber: contractorDto.phoneNumber,
        address: contractorDto.address,
      },
    });
    return contractor;
  }
}
