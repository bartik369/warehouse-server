import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationDto } from './dtos/location.dto';

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
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateLocation(
    @Param('id') id: string,
    @Body() locationDto: LocationDto,
  ) {
    return await this.locationsService.updateLocation(id, locationDto);
  }
}
