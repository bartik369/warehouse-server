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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const location_exceptions_1 = require("../../exceptions/location.exceptions");
let LocationsService = class LocationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLocations() {
        const locations = await this.prisma.location.findMany({});
        return locations;
    }
    async getLocation(id) {
        const location = await this.prisma.location.findUnique({
            where: { id: id },
        });
        if (!location)
            throw new location_exceptions_1.LocationNotFoundException();
        return location;
    }
    async createLocation(locationDto) {
        const existingLocation = await this.prisma.location.findUnique({
            where: { name: locationDto.name?.trim() },
        });
        if (existingLocation)
            throw new location_exceptions_1.LocationExistException();
        const location = await this.prisma.location.create({
            data: {
                name: locationDto.name?.trim(),
                slug: locationDto.slug?.trim(),
                comment: locationDto.comment || undefined,
            },
        });
        return location;
    }
    async updateLocation(id, locationDto) {
        const existLocation = await this.prisma.location.findUnique({
            where: { id: id },
        });
        if (!existLocation)
            throw new location_exceptions_1.LocationNotFoundException();
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
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map