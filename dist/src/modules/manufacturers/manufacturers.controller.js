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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManufacturersController = void 0;
const common_1 = require("@nestjs/common");
const manufacturers_service_1 = require("./manufacturers.service");
const manufacturer_dto_1 = require("./dto/manufacturer.dto");
const constants_1 = require("../../common/utils/constants");
let ManufacturersController = class ManufacturersController {
    constructor(manufacturersService) {
        this.manufacturersService = manufacturersService;
    }
    async createManufacturer(manufacturerDto) {
        const manufacturer = await this.manufacturersService.createManufacturer(manufacturerDto);
        return {
            message: constants_1.manufacturerCreated,
            manufacturer,
        };
    }
    async getManufacturers() {
        return await this.manufacturersService.getManufacturers();
    }
    async getManufacturer(id) {
        return await this.manufacturersService.getManufacturer(id);
    }
    async updateManufacturer(id, manufacturerDto) {
        const updatedManufacturer = await this.manufacturersService.updateManufacturer(id, manufacturerDto);
        return {
            message: constants_1.manufacturerUpdated,
            updatedManufacturer,
        };
    }
};
exports.ManufacturersController = ManufacturersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manufacturer_dto_1.ManufacturerDto]),
    __metadata("design:returntype", Promise)
], ManufacturersController.prototype, "createManufacturer", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManufacturersController.prototype, "getManufacturers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManufacturersController.prototype, "getManufacturer", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manufacturer_dto_1.ManufacturerDto]),
    __metadata("design:returntype", Promise)
], ManufacturersController.prototype, "updateManufacturer", null);
exports.ManufacturersController = ManufacturersController = __decorate([
    (0, common_1.Controller)('manufacturers'),
    __metadata("design:paramtypes", [manufacturers_service_1.ManufacturersService])
], ManufacturersController);
//# sourceMappingURL=manufacturers.controller.js.map