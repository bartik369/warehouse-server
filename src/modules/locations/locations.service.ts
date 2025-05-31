import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ILocation } from 'src/common/types/location.types';
import {
  LocationExistException,
  LocationNotFoundException,
} from 'src/exceptions/location.exceptions';
import { CreateLocationDto } from './dtos/location-create.dto';
import { LocationBaseDto } from './dtos/location-base.dto';
import { UpdateLocationDto } from './dtos/location-update.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}
  // All
  async getLocations(): Promise<LocationBaseDto[]> {
    const locations = await this.prisma.location.findMany({});
    return locations;
  }
  //By ID
  async getLocation(id: string): Promise<LocationBaseDto> {
    const location = await this.prisma.location.findUnique({
      where: { id: id },
    });
    if (!location) throw new LocationNotFoundException();
    return location;
  }
  // Create
  async createLocation(
    locationDto: CreateLocationDto,
  ): Promise<LocationBaseDto> {
    const existingLocation = await this.prisma.location.findUnique({
      where: { name: locationDto.name },
    });
    if (existingLocation) throw new LocationExistException();

    const location = await this.prisma.location.create({
      data: {
        name: locationDto.name,
        slug: locationDto.slug,
        comment: locationDto.comment || '',
      },
    });
    return location;
  }
  // Update
  async updateLocation(
    id: string,
    locationDto: UpdateLocationDto,
  ): Promise<LocationBaseDto> {
    const existLocation = await this.prisma.location.findUnique({
      where: { id: id },
    });
    if (!existLocation) throw new LocationNotFoundException();

    const updatedLocation = await this.prisma.location.update({
      where: { id: existLocation.id },
      data: {
        name: locationDto.name,
        slug: locationDto.slug,
        comment: locationDto.comment || '',
      },
    });
    return updatedLocation;
  }
}
