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
exports.DevicesController = void 0;
const device_dto_1 = require("./dtos/device.dto");
const common_1 = require("@nestjs/common");
const devices_service_1 = require("./devices.service");
const constants_1 = require("../../common/utils/constants");
let DevicesController = class DevicesController {
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    async createDevice(deviceDto) {
        const device = await this.devicesService.createDevice(deviceDto);
        return {
            message: constants_1.deviceCreated,
            device,
        };
    }
    async findAll(city, query) {
        const result = await this.devicesService.findAll(query, city);
        const { devices, totalPages } = result;
        return { devices, totalPages };
    }
    async getOptions(city) {
        return await this.devicesService.getOptions(city);
    }
    async getDevice(id) {
        return await this.devicesService.getDevice(id);
    }
    async updateDevice(id, deviceDto) {
        const updatedDevice = await this.devicesService.updateDevice(id, deviceDto);
        return {
            message: constants_1.deviceUpdated,
            updatedDevice,
        };
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [device_dto_1.DeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createDevice", null);
__decorate([
    (0, common_1.Get)('/locations/:city'),
    __param(0, (0, common_1.Param)('city')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/options/:city'),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getOptions", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "getDevice", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, device_dto_1.DeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "updateDevice", null);
exports.DevicesController = DevicesController = __decorate([
    (0, common_1.Controller)('devices'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map