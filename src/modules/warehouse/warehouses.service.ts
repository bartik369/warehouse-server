import { PrismaService } from 'prisma/prisma.service';
import { Injectable } from "@nestjs/common";

@Injectable()
export class WarehousesService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        const warehouses = await this.prisma.warehouse.findMany();
        if (warehouses) return warehouses;
        return null
    }
}