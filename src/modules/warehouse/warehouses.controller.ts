import { Controller } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { WarehousesService } from "./warehouses.service";

@Controller('warehouses')
export class WarehousesController {
    constructor(
        private warehousesService: WarehousesService
    ) {}
@Get()
async findAll() {
    return await this.warehousesService.findAll();  
}
}