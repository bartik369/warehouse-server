import { WarehouseDto } from './dtos/warehouseDto';
import { Body, Controller, Post, Param, Put } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { warehouseCreated, warehouseUpdated } from 'src/common/utils/constants';
import { IWarehouse } from './types/warehouse.types';

@Controller('warehouses')
export class WarehousesController {
  constructor(private warehousesService: WarehousesService) {}

  // Get all assignable
  @Get('assignable/:locationId')
  async getAssignable(
    @Param('locationId') locationId: string,
  ): Promise<IWarehouse[]> {
    return await this.warehousesService.getAssignable(locationId);
  }
  // Get all
  @Get()
  async findAll() {
    return await this.warehousesService.findAll();
  }
  //Create
  @Post()
  async createWarehouse(
    @Body() warehouseDto: WarehouseDto,
  ): Promise<{ message: string; warehouse: IWarehouse }> {
    const warehouse =
      await this.warehousesService.createWarehouse(warehouseDto);
    return {
      message: warehouseCreated,
      warehouse,
    };
  }
  // Get by ID
  @Get(':id')
  async getWarehouse(@Param('id') id: string) {
    return await this.warehousesService.getWarehouse(id);
  }
  // Update
  @Put(':id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() warehouseDto: WarehouseDto,
  ) {
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
