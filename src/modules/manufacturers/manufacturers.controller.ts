import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
  manufacturerCreated,
  manufacturerUpdated,
} from 'src/common/utils/constants';
import { CreateManufacturerDto } from './dto/manufacturer-create.dto';
import { ManufacturerBaseDto } from './dto/manufacturer-base.dto';
import { UpdateManufacturerDto } from './dto/manufacturer-update.dto';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private manufacturersService: ManufacturersService) {}

  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createManufacturer(
    @Body() manufacturerDto: CreateManufacturerDto,
  ): Promise<{ message: string; manufacturer: ManufacturerBaseDto }> {
    const manufacturer =
      await this.manufacturersService.createManufacturer(manufacturerDto);
    return {
      message: manufacturerCreated,
      manufacturer,
    };
  }

  // Get All
  @Get()
  async getManufacturers(): Promise<ManufacturerBaseDto[]> {
    return await this.manufacturersService.getManufacturers();
  }
  // Get by ID
  @Get(':id')
  async getManufacturer(@Param('id') id: string): Promise<ManufacturerBaseDto> {
    return await this.manufacturersService.getManufacturer(id);
  }
  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateManufacturer(
    @Param('id') id: string,
    @Body() manufacturerDto: UpdateManufacturerDto,
  ): Promise<{ message: string; updatedManufacturer: ManufacturerBaseDto }> {
    const updatedManufacturer =
      await this.manufacturersService.updateManufacturer(id, manufacturerDto);
    return {
      message: manufacturerUpdated,
      updatedManufacturer,
    };
  }
}
