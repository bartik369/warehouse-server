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
exports.ManufacturersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const device_exceptions_1 = require("../../exceptions/device.exceptions");
let ManufacturersService = class ManufacturersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getManufacturers() {
        const manufacturers = await this.prisma.manufacturer.findMany();
        return manufacturers;
    }
    async getManufacturer(id) {
        const manufacturer = await this.prisma.manufacturer.findUnique({
            where: { id: id },
        });
        if (!manufacturer)
            throw new device_exceptions_1.ManufacturerNotFoundException();
        return manufacturer;
    }
    async updateManufacturer(id, manufacturerDto) {
        const existManufacturer = await this.prisma.manufacturer.findUnique({
            where: { id: id },
        });
        if (!existManufacturer)
            throw new device_exceptions_1.ManufacturerNotFoundException();
        const updatedManufacturer = await this.prisma.manufacturer.update({
            where: { id: id },
            data: {
                name: manufacturerDto.name?.trim(),
                slug: manufacturerDto.slug?.trim(),
                comment: manufacturerDto.comment || undefined,
            },
        });
        return updatedManufacturer;
    }
    async createManufacturer(manufacturerDto) {
        const existingManufacturer = await this.prisma.manufacturer.findFirst({
            where: {
                name: manufacturerDto.name?.trim(),
                slug: manufacturerDto.slug?.trim(),
            },
        });
        if (existingManufacturer)
            throw new device_exceptions_1.ManufacturerExistsException();
        const manufacturer = await this.prisma.manufacturer.create({
            data: {
                name: manufacturerDto.name?.trim(),
                slug: manufacturerDto.slug?.trim(),
                comment: manufacturerDto.comment || undefined,
            },
        });
        return manufacturer;
    }
};
exports.ManufacturersService = ManufacturersService;
exports.ManufacturersService = ManufacturersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ManufacturersService);
//# sourceMappingURL=manufacturers.service.js.map