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
import { locationCreated, locationUpdated } from 'src/common/utils/constants';
import { LocationBaseDto } from './dtos/location-base.dto';
import { UpdateLocationDto } from './dtos/location-update.dto';
import { CreateLocationDto } from './dtos/location-create.dto';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}
  // All
  @Get()
  async getLocations(): Promise<LocationBaseDto[]> {
    return await this.locationsService.getLocations();
  }
  // By ID
  @Get(':id')
  async getLocation(@Param('id') id: string): Promise<LocationBaseDto> {
    return await this.locationsService.getLocation(id);
  }
  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createLocation(
    @Body() locationDto: CreateLocationDto,
  ): Promise<{ message: string; location: LocationBaseDto }> {
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
    @Body() locationDto: UpdateLocationDto,
  ): Promise<{ message: string; updatedLocation: LocationBaseDto }> {
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
