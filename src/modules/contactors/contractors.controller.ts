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
import {
  contractorCreated,
  contractorUpdated,
} from 'src/common/utils/constants';
import { ContractorBaseDto } from './dtos/contactor-base.dto';
import { CreateContractorDto } from './dtos/create-contractor.dto';
import { UpdateContractorDto } from './dtos/update-contractor.dto';
import { ContractorsService } from './contractors.service';

@Controller('contractors')
export class ContractorsController {
  constructor(private contractorsService: ContractorsService) {}
  // All
  @Get()
  async getContractors(): Promise<ContractorBaseDto[]> {
    return await this.contractorsService.getContractors();
  }
  // Create
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  async createContractor(
    @Body() contractorDto: CreateContractorDto,
  ): Promise<{ message: string; contractor: ContractorBaseDto }> {
    const contractor =
      await this.contractorsService.createContractor(contractorDto);
    return {
      message: contractorCreated,
      contractor,
    };
  }
  // Get by ID
  @Get(':id')
  async getContractor(@Param('id') id: string): Promise<ContractorBaseDto> {
    return await this.contractorsService.getContractor(id);
  }
  // Update
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Put(':id')
  async updateContractor(
    @Param('id') id: string,
    @Body() contractorDto: UpdateContractorDto,
  ): Promise<{ message: string; updatedContractor: ContractorBaseDto }> {
    const updatedContractor = await this.contractorsService.updateContractor(
      id,
      contractorDto,
    );
    return {
      message: contractorUpdated,
      updatedContractor,
    };
  }
}
