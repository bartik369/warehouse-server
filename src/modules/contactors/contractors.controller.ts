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
import { ContractorDto } from './dtos/contactor.dto';
import { ContractorsService } from './contractors.service';

@Controller('contractors')
export class ContractorsController {
  constructor(private contractorsService: ContractorsService) {}
  // All
  @Get()
  async getContractors(): Promise<ContractorDto[]> {
    return await this.contractorsService.getContractors();
  }
  // Create
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  async createContractor(
    @Body() contractorDto: ContractorDto,
  ): Promise<{ message: string; contractor: ContractorDto }> {
    const contractor =
      await this.contractorsService.createContractor(contractorDto);
    return {
      message: contractorCreated,
      contractor,
    };
  }
  // Get by ID
  @Get(':id')
  async getContractor(@Param('id') id: string): Promise<ContractorDto> {
    return await this.contractorsService.getContractor(id);
  }
  // Update
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Put(':id')
  async updateContractor(
    @Param('id') id: string,
    @Body() contractorDto: ContractorDto,
  ): Promise<{ message: string; updatedContractor: ContractorDto }> {
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
