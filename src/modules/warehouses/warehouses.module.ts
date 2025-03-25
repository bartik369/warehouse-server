import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import { PrismaModule } from "prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule],
    controllers: [WarehousesController],
    providers: [WarehousesService]
})
export class WarehousesModule {}