import { LocationsService } from './locations.service';
import { LocationDto } from './dtos/location.dto';
export declare class LocationsController {
    private locationsService;
    constructor(locationsService: LocationsService);
    getLocations(): Promise<LocationDto[]>;
    getLocation(id: string): Promise<LocationDto>;
    createLocation(locationDto: LocationDto): Promise<{
        message: string;
        location: LocationDto;
    }>;
    updateLocation(id: string, locationDto: LocationDto): Promise<{
        message: string;
        updatedLocation: LocationDto;
    }>;
}
