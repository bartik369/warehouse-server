import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { ContractorDto } from './dtos/contactor.dto';

@Controller('contractors')
export class ContractorsController {
  constructor(private contractorsService: ContractorsService) {}
  @Get()
  async getContractors() {
    return await this.contractorsService.getContractors();
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createContactor(@Body() contractorDto: ContractorDto) {
    return await this.contractorsService.createContractor(contractorDto);
  }

  @Get(':id')
  async getContractor(@Param('id') id: string) {
    return await this.contractorsService.getContractor(id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateContractor(
    @Param('id') id: string,
    @Body() contractorDto: ContractorDto,
  ) {
    return await this.contractorsService.updateContractor(id, contractorDto);
  }
}
