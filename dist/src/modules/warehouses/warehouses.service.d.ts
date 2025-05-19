import { PrismaService } from 'prisma/prisma.service';
import { WarehouseDto } from './dtos/warehouseDto';
import { IWarehouse } from './types/warehouse.types';
export declare class WarehousesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        locationId: string | null;
        comment: string | null;
    }[]>;
    getAssignable(locationId: string): Promise<IWarehouse[]>;
    createWarehouse(warehouseDto: WarehouseDto): Promise<IWarehouse>;
    getWarehouse(id: string): Promise<{
        locationName: string;
        id: string;
        name: string;
        slug: string;
        locationId: string | null;
        comment: string | null;
    }>;
    updateWarehouse(id: string, warehouseDto: WarehouseDto): Promise<{
        id: string;
        name: string;
        slug: string;
        locationId: string | null;
        comment: string | null;
    }>;
}
