import { CreateContractorDto } from './dtos/create-contractor.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ContractorBaseDto } from './dtos/contactor-base.dto';
import {
  ContactorExistsException,
  ContactorNotFoundException,
} from 'src/exceptions/device.exceptions';
import { UpdateContractorDto } from './dtos/update-contractor.dto';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}
  // GET CONTRACTORS
  async getContractors(): Promise<ContractorBaseDto[]> {
    return this.prisma.contractor.findMany({});
  }
  // CREATE CONTRACTORS
  async createContractor(
    contractorDto: CreateContractorDto,
  ): Promise<ContractorBaseDto> {
    const existContractor = await this.prisma.contractor.findUnique({
      where: {
        name: contractorDto.name,
      },
    });
    if (existContractor) throw new ContactorExistsException();
    const contractor = await this.prisma.contractor.create({
      data: contractorDto,
    });
    return contractor;
  }
  // GET CONTRACTOR BY ID
  async getContractor(id: string): Promise<ContractorBaseDto> {
    const contractor = await this.prisma.contractor.findUnique({
      where: { id: id },
    });
    return contractor;
  }
  // UPDATE CONTRACTOR
  async updateContractor(
    id: string,
    contractorDto: UpdateContractorDto,
  ): Promise<ContractorBaseDto> {
    const existContractor = await this.prisma.contractor.findUnique({
      where: { id: id },
    });
    if (!existContractor) throw new ContactorNotFoundException();
    const updatedContractor = await this.prisma.contractor.update({
      where: { id },
      data: contractorDto,
    });
    return updatedContractor;
  }
}
