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
exports.ContractorsController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../common/utils/constants");
const contactor_dto_1 = require("./dtos/contactor.dto");
const contractors_service_1 = require("./contractors.service");
let ContractorsController = class ContractorsController {
    constructor(contractorsService) {
        this.contractorsService = contractorsService;
    }
    async getContractors() {
        return await this.contractorsService.getContractors();
    }
    async createContractor(contractorDto) {
        const contractor = await this.contractorsService.createContractor(contractorDto);
        return {
            message: constants_1.contractorCreated,
            contractor,
        };
    }
    async getContractor(id) {
        return await this.contractorsService.getContractor(id);
    }
    async updateContractor(id, contractorDto) {
        const updatedContractor = await this.contractorsService.updateContractor(id, contractorDto);
        return {
            message: constants_1.contractorUpdated,
            updatedContractor,
        };
    }
};
exports.ContractorsController = ContractorsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractorsController.prototype, "getContractors", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contactor_dto_1.ContractorDto]),
    __metadata("design:returntype", Promise)
], ContractorsController.prototype, "createContractor", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractorsController.prototype, "getContractor", null);
__decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contactor_dto_1.ContractorDto]),
    __metadata("design:returntype", Promise)
], ContractorsController.prototype, "updateContractor", null);
exports.ContractorsController = ContractorsController = __decorate([
    (0, common_1.Controller)('contractors'),
    __metadata("design:paramtypes", [contractors_service_1.ContractorsService])
], ContractorsController);
//# sourceMappingURL=contractors.controller.js.map