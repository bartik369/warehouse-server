import { ManufacturersService } from './manufacturers.service';
import { ManufacturerDto } from './dto/manufacturer.dto';
export declare class ManufacturersController {
    private manufacturersService;
    constructor(manufacturersService: ManufacturersService);
    createManufacturer(manufacturerDto: ManufacturerDto): Promise<{
        message: string;
        manufacturer: ManufacturerDto;
    }>;
    getManufacturers(): Promise<ManufacturerDto[]>;
    getManufacturer(id: string): Promise<ManufacturerDto>;
    updateManufacturer(id: string, manufacturerDto: ManufacturerDto): Promise<{
        message: string;
        updatedManufacturer: ManufacturerDto;
    }>;
}
