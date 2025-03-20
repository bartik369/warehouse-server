import { WarehouseDto } from './dtos/warehouseDto';
import { Body, Controller, Post, Param, Put } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private warehousesService: WarehousesService) {}
  @Get()
  async findAll() {
    return await this.warehousesService.findAll();
  }
  @Post()
  async createWarehouse(@Body() warehouseDto: WarehouseDto) {
    return await this.warehousesService.createWarehouse(warehouseDto);
  }
  @Get(':id')
  async getWarehouse(@Param('id') id: string) {
    return await this.warehousesService.getWarehouse(id);
  }
  @Put(':id')
  async updateWarehouse(
    @Param('id') id: string,
    @Body() warehouseDto: WarehouseDto,
  ) {
    await this.warehousesService.updateWarehouse(id, warehouseDto);
  }
}
