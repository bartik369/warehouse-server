import { PrismaService } from 'prisma/prisma.service';
import { ManufacturerDto } from './dto/manufacturer.dto';
export declare class ManufacturersService {
    private prisma;
    constructor(prisma: PrismaService);
    getManufacturers(): Promise<ManufacturerDto[]>;
    getManufacturer(id: string): Promise<ManufacturerDto>;
    updateManufacturer(id: string, manufacturerDto: ManufacturerDto): Promise<ManufacturerDto>;
    createManufacturer(manufacturerDto: ManufacturerDto): Promise<ManufacturerDto>;
}
