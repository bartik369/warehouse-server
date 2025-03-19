import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get()
  async getLocations() {
    return await this.locationsService.getLocations();
  }
  @Get(':id')
  async getLocation(@Param('id') id: string) {
    return await this.locationsService.getLocation(id);
  }
}
