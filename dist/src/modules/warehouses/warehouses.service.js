"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehousesService = void 0;
const prisma_service_1 = require("../../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const location_exceptions_1 = require("../../exceptions/location.exceptions");
let WarehousesService = class WarehousesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const warehouses = await this.prisma.warehouse.findMany();
        if (warehouses)
            return warehouses;
        return null;
    }
    async getAssignable(locationId) {
        const existLocation = await this.prisma.location.findUnique({
            where: { id: locationId },
        });
        if (!existLocation)
            throw new location_exceptions_1.LocationNotFoundException();
        const warehouses = await this.prisma.warehouse.findMany({
            where: {
                locationId: locationId,
            },
        });
        return warehouses;
    }
    async createWarehouse(warehouseDto) {
        const [existWarehouse, existLocation] = await Promise.all([
            this.prisma.warehouse.findUnique({
                where: { name: warehouseDto.name },
            }),
            this.prisma.location.findUnique({
                where: { name: warehouseDto.locationName },
            }),
        ]);
        if (existWarehouse)
            throw new location_exceptions_1.WarehouseExistException();
        if (!existLocation)
            throw new location_exceptions_1.LocationNotFoundException();
        const warehouse = await this.prisma.warehouse.create({
            data: {
                name: warehouseDto.name?.trim(),
                slug: warehouseDto.slug?.trim(),
                locationId: existLocation.id,
                comment: warehouseDto.comment || undefined,
            },
        });
        return warehouse;
    }
    async getWarehouse(id) {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: id },
            include: {
                location: {
                    select: { name: true },
                },
            },
        });
        if (!warehouse)
            return null;
        const { location, ...rest } = warehouse;
        return { ...rest, locationName: location?.name || null };
    }
    async updateWarehouse(id, warehouseDto) {
        const existWarehouse = await this.prisma.warehouse.findUnique({
            where: { id: id },
        });
        if (!existWarehouse)
            throw new location_exceptions_1.WarehouseNotFoundException();
        const updatedWarehouse = await this.prisma.warehouse.update({
            where: { id: id },
            data: {
                name: warehouseDto.name?.trim(),
                slug: warehouseDto.slug?.trim(),
                comment: warehouseDto.comment || undefined,
            },
        });
        return updatedWarehouse;
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map