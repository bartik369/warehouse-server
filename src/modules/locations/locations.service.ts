import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ILocation } from 'src/common/types/location.types';
import { LocationDto } from './dtos/location.dto';
import { LocationNotFoundException } from 'src/exceptions/location.exceptions';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getLocations(): Promise<ILocation[]> {
    const locations = await this.prisma.location.findMany({});
    return locations;
  }
  async getLocation(id: string): Promise<ILocation> {
    const location = await this.prisma.location.findUnique({
      where: { id: id },
    });
    if (!location) return null;
    return location;
  }
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
        name: locationDto.name?.trim() || existLocation.name,
        slug: locationDto.slug?.trim() || existLocation.slug,
        comment: locationDto.comment || existLocation.comment,
      },
    });
    return updatedLocation;
  }
}
