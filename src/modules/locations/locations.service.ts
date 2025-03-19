import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ILocation } from 'src/common/types/location.types';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getLocations(): Promise<ILocation[]> {
    const locations = await this.prisma.location.findMany({});
    return locations;
  }
  async getLocation(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id: id },
    });
    if (!location) return null;
    return location;
  }
}
