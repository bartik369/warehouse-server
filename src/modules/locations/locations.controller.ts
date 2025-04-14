import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationDto } from './dtos/location.dto';
import { locationCreated, locationUpdated } from 'src/common/utils/constants';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}
  // All
  @Get()
  async getLocations(): Promise<LocationDto[]> {
    return await this.locationsService.getLocations();
  }
  // By ID
  @Get(':id')
  async getLocation(@Param('id') id: string): Promise<LocationDto> {
    return await this.locationsService.getLocation(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createLocation(
    @Body() locationDto: LocationDto,
  ): Promise<{ message: string; location: LocationDto }> {
    const location = await this.locationsService.createLocation(locationDto);
    return {
      message: locationCreated,
      location,
    };
  }
  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateLocation(
    @Param('id') id: string,
    @Body() locationDto: LocationDto,
  ): Promise<{ message: string; updatedLocation: LocationDto }> {
    const updatedLocation = await this.locationsService.updateLocation(
      id,
      locationDto,
    );
    return {
      message: locationUpdated,
      updatedLocation,
    };
  }
}
