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
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const location_exceptions_1 = require("../../exceptions/location.exceptions");
let DepartmentsService = class DepartmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDepartments() {
        const departments = await this.prisma.department.findMany({});
        if (!departments)
            throw new location_exceptions_1.DepartmentNotFoundException();
        return departments;
    }
    async getDepartment(id) {
        const department = await this.prisma.department.findUnique({
            where: { id: id },
        });
        if (!department)
            throw new location_exceptions_1.DepartmentNotFoundException();
        return department;
    }
    async createDepartment(departmentDto) {
        const existDepartment = await this.prisma.department.findUnique({
            where: {
                name: departmentDto.name.trim(),
            },
        });
        if (existDepartment)
            throw new location_exceptions_1.DepartmentExistException();
        const department = await this.prisma.department.create({
            data: {
                name: departmentDto.name.trim(),
                slug: departmentDto.slug.trim(),
                comment: departmentDto.comment || undefined,
            },
        });
        return department;
    }
    async updateDepartment(id, departmentDto) {
        const existDepartment = await this.prisma.department.findUnique({
            where: { id: id },
        });
        if (!existDepartment)
            throw new location_exceptions_1.DepartmentNotFoundException();
        const updatedDepartment = await this.prisma.department.update({
            where: { id: existDepartment.id },
            data: {
                name: departmentDto.name?.trim(),
                slug: departmentDto.slug?.trim(),
                comment: departmentDto.comment || undefined,
            },
        });
        return updatedDepartment;
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map