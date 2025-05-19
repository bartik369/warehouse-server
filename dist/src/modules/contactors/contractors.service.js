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
exports.ContractorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const device_exceptions_1 = require("../../exceptions/device.exceptions");
let ContractorsService = class ContractorsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getContractors() {
        return this.prisma.contractor.findMany({});
    }
    async createContractor(contractorDto) {
        const existContractor = await this.prisma.contractor.findUnique({
            where: {
                name: contractorDto.name?.trim(),
            },
        });
        if (existContractor)
            throw new device_exceptions_1.ContactorExistsException();
        const contractor = await this.prisma.contractor.create({
            data: {
                name: contractorDto.name?.trim(),
                slug: contractorDto.slug?.trim(),
                phoneNumber: contractorDto.phoneNumber?.trim(),
                address: contractorDto.address || undefined,
            },
        });
        return contractor;
    }
    async getContractor(id) {
        const contractor = await this.prisma.contractor.findUnique({
            where: { id: id },
        });
        return contractor;
    }
    async updateContractor(id, contractorDto) {
        const existContractor = await this.prisma.contractor.findUnique({
            where: { id: id },
        });
        if (!existContractor)
            throw new device_exceptions_1.ContactorNotFoundException();
        const updatedContractor = await this.prisma.contractor.update({
            where: { id },
            data: {
                name: contractorDto.name?.trim(),
                slug: contractorDto.slug?.trim(),
                phoneNumber: contractorDto.phoneNumber?.trim(),
                address: contractorDto.address || undefined,
            },
        });
        return updatedContractor;
    }
};
exports.ContractorsService = ContractorsService;
exports.ContractorsService = ContractorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractorsService);
//# sourceMappingURL=contractors.service.js.map