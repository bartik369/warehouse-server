import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ContractorDto } from './dtos/contactor.dto';
import {
  ContactorExistsException,
  ContactorNotFoundException,
} from 'src/exceptions/device.exceptions';
import { somethingWentWrong } from 'src/common/utils/constants';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}
  // GET CONTRACTORS
  async getContractors(): Promise<ContractorDto[]> {
    return this.prisma.contractor.findMany({});
  }
  // CREATE CONTRACTORS
  async createContractor(contractorDto: ContractorDto): Promise<ContractorDto> {
    const existContractor = await this.prisma.contractor.findUnique({
      where: {
        name: contractorDto.name?.trim(),
      },
    });
    if (existContractor) throw new ContactorExistsException();
    const contractor = await this.prisma.contractor.create({
      data: {
        name: contractorDto.name?.trim(),
        slug: contractorDto.slug?.trim(),
        phoneNumber: contractorDto.phoneNumber?.trim(),
        address: contractorDto.address || '',
      },
    });
    return contractor;
  }
  // GET CONTRACTOR BY ID
  async getContractor(id: string): Promise<ContractorDto> {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: id },
    });
    return contractor;
  }
  // UPDATE CONTRACTOR
  async updateContractor(
    id: string,
    contractorDto: ContractorDto,
  ): Promise<ContractorDto> {
    const existContractor = await this.prisma.contractor.findUnique({
      where: { id: id },
    });
    if (!existContractor) throw new ContactorNotFoundException();
    const updatedContractor = await this.prisma.contractor.update({
      where: { id },
      data: {
        name: contractorDto.name?.trim(),
        slug: contractorDto.slug?.trim(),
        phoneNumber: contractorDto.phoneNumber?.trim(),
        address: contractorDto.address || '',
      },
    });
    return updatedContractor;
  }
}
