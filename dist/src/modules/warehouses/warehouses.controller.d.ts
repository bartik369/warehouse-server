import { WarehouseDto } from './dtos/warehouseDto';
import { WarehousesService } from './warehouses.service';
import { IWarehouse } from './types/warehouse.types';
export declare class WarehousesController {
    private warehousesService;
    constructor(warehousesService: WarehousesService);
    getAssignable(locationId: string): Promise<IWarehouse[]>;
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        locationId: string | null;
        comment: string | null;
    }[]>;
    createWarehouse(warehouseDto: WarehouseDto): Promise<{
        message: string;
        warehouse: IWarehouse;
    }>;
    getWarehouse(id: string): Promise<{
        locationName: string;
        id: string;
        name: string;
        slug: string;
        locationId: string | null;
        comment: string | null;
    }>;
    updateWarehouse(id: string, warehouseDto: WarehouseDto): Promise<{
        message: string;
        updatedWarehouse: {
            id: string;
            name: string;
            slug: string;
            locationId: string | null;
            comment: string | null;
        };
    }>;
}
