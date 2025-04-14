import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ILocation } from 'src/common/types/location.types';
import { LocationDto } from './dtos/location.dto';
import {
  LocationExistException,
  LocationNotFoundException,
} from 'src/exceptions/location.exceptions';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}
  // All
  async getLocations(): Promise<ILocation[]> {
    const locations = await this.prisma.location.findMany({});
    return locations;
  }
  //By ID
  async getLocation(id: string): Promise<ILocation> {
    const location = await this.prisma.location.findUnique({
      where: { id: id },
    });
    if (!location) throw new LocationNotFoundException();
    return location;
  }
  // Create
  async createLocation(locationDto: LocationDto) {
    const existingLocation = await this.prisma.location.findUnique({
      where: { name: locationDto.name?.trim() },
    });
    if (existingLocation) throw new LocationExistException();
    const location = await this.prisma.location.create({
      data: {
        name: locationDto.name?.trim(),
        slug: locationDto.slug?.trim(),
        comment: locationDto.comment || undefined,
      },
    });
    return location;
  }
  // Update
  async updateLocation(
    id: string,
    locationDto: LocationDto,
  ): Promise<ILocation> {
    const existLocation = await this.prisma.location.findUnique({
      where: { id: id },
    });
    if (!existLocation) throw new LocationNotFoundException();

    const updatedLocation = await this.prisma.location.update({
      where: { id: existLocation.id },
      data: {
        name: locationDto.name?.trim(),
        slug: locationDto.slug?.trim(),
        comment: locationDto.comment || undefined,
      },
    });
    return updatedLocation;
  }
}
