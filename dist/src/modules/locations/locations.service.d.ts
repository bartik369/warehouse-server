import { PrismaService } from 'prisma/prisma.service';
import { ILocation } from 'src/common/types/location.types';
import { LocationDto } from './dtos/location.dto';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getLocations(): Promise<ILocation[]>;
    getLocation(id: string): Promise<ILocation>;
    createLocation(locationDto: LocationDto): Promise<{
        id: string;
        name: string;
        slug: string;
        comment: string | null;
    }>;
    updateLocation(id: string, locationDto: LocationDto): Promise<ILocation>;
}
