import { WarehouseDto } from './dtos/warehouseDto';
import { Body, Controller, Post } from '@nestjs/common';
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
    const result = await this.warehousesService.createWarehouse(warehouseDto);
    console.log(result);
  }
}
