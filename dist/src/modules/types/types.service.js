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
exports.TypesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const device_exceptions_1 = require("../../exceptions/device.exceptions");
let TypesService = class TypesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTypes() {
        const types = await this.prisma.device_type.findMany({});
        return types;
    }
    async createType(typeDto) {
        const existingType = await this.prisma.device_type.findUnique({
            where: {
                name: typeDto.name?.trim(),
                slug: typeDto.slug?.trim(),
            },
        });
        if (existingType)
            throw new device_exceptions_1.TypeExistsException();
        const type = await this.prisma.device_type.create({
            data: {
                name: typeDto.name?.trim(),
                slug: typeDto.slug?.trim(),
            },
        });
        return type;
    }
    async getType(id) {
        const type = await this.prisma.device_type.findUnique({
            where: { id: id },
        });
        if (!type)
            throw new device_exceptions_1.TypeNotFoundException();
        return type;
    }
    async updateType(typeDto, id) {
        const existType = await this.prisma.device_type.findUnique({
            where: { id: id },
        });
        if (!existType)
            throw new device_exceptions_1.TypeNotFoundException();
        const updatedType = await this.prisma.device_type.update({
            where: { id: existType.id },
            data: {
                name: typeDto.name?.trim(),
                slug: typeDto.slug?.trim(),
            },
        });
        return updatedType;
    }
};
exports.TypesService = TypesService;
exports.TypesService = TypesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TypesService);
//# sourceMappingURL=types.service.js.map