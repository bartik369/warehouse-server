import { WarehouseBaseDto } from './dtos/warehouseBase.dto';
import { Body, Controller, Post, Param, Put } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { warehouseCreated, warehouseUpdated } from 'src/common/utils/constants';
import { CreateWarehouseDto } from './dtos/create-warehouse.dto';
import { UpdateWarehouseDto } from './dtos/update-warehouse.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(private warehousesService: WarehousesService) {}

  // Get all assignable
  @Get('assignable/:locationId')
  async getAssignable(
    @Param('locationId') locationId: string,
  ): Promise<WarehouseBaseDto[]> {
    return await this.warehousesService.getAssignable(locationId);
  }
  // Get all
  @Get()
  async findAll(): Promise<WarehouseBaseDto[]> {
    return await this.warehousesService.findAll();
  }
  @Get('/by-user/:id')
  async getWarehousesByUser(
    @Param('id') id: string,
  ): Promise<WarehouseBaseDto[]> {
    return await this.warehousesService.getWarehousesByUser(id);
  }
  //Create
  @Post()
  async createWarehouse(
    @Body() warehouseDto: CreateWarehouseDto,
  ): Promise<{ message: string; warehouse: WarehouseBaseDto }> {
    const warehouse =
      await this.warehousesService.createWarehouse(warehouseDto);
    return {
      message: warehouseCreated,
      warehouse,
    };
  }
  // Get by ID
  @Get(':id')
  async getWarehouse(@Param('id') id: string): Promise<WarehouseBaseDto> {
    return await this.warehousesService.getWarehouse(id);
  }
  // Update
  @Put(':id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() warehouseDto: UpdateWarehouseDto,
  ): Promise<{ message: string; updatedWarehouse: WarehouseBaseDto }> {
    const updatedWarehouse = await this.warehousesService.updateWarehouse(
      id,
      warehouseDto,
    );
    return {
      message: warehouseUpdated,
      updatedWarehouse,
    };
  }
}
