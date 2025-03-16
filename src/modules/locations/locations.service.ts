import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ILocation } from 'src/common/types/location.types';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getLocation(): Promise<ILocation[]> {
    const locations = await this.prisma.location.findMany({});
    return locations;
  }
}
