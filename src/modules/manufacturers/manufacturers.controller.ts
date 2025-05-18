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
import { ManufacturerDto } from './dto/manufacturer.dto';
import {
  manufacturerCreated,
  manufacturerUpdated,
} from 'src/common/utils/constants';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private manufacturersService: ManufacturersService) {}
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createManufacturer(
    @Body() manufacturerDto: ManufacturerDto,
  ): Promise<{ message: string; manufacturer: ManufacturerDto }> {
    const manufacturer =
      await this.manufacturersService.createManufacturer(manufacturerDto);
    return {
      message: manufacturerCreated,
      manufacturer,
    };
  }

  // Get All
  @Get()
  async getManufacturers(): Promise<ManufacturerDto[]> {
    return await this.manufacturersService.getManufacturers();
  }
  // Get by ID
  @Get(':id')
  async getManufacturer(@Param('id') id: string): Promise<ManufacturerDto> {
    return await this.manufacturersService.getManufacturer(id);
  }
  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  async updateManufacturer(
    @Param('id') id: string,
    @Body() manufacturerDto: ManufacturerDto,
  ): Promise<{ message: string; updatedManufacturer: ManufacturerDto }> {
    const updatedManufacturer =
      await this.manufacturersService.updateManufacturer(id, manufacturerDto);
    return {
      message: manufacturerUpdated,
      updatedManufacturer,
    };
  }
}
