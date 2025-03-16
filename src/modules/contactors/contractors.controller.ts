import { Body, Controller, Post, Get } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { ContractorDto } from './dtos/contactor.dto';

@Controller('contractors')
export class ContractorsController {
  constructor(private contractorsService: ContractorsService) {}
  @Get()
  async getContractors() {
    return await this.contractorsService.getContractors();
  }
  @Post()
  async createContactor(@Body() contractorDto: ContractorDto) {
    return await this.contractorsService.createContractor(contractorDto);
  }
}
