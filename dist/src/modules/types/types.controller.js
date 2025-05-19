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
exports.TypesController = void 0;
const common_1 = require("@nestjs/common");
const types_service_1 = require("./types.service");
const type_dto_1 = require("./dto/type.dto");
const constants_1 = require("../../common/utils/constants");
const form_data_interceptor_1 = require("../../common/interceptors/form-data.interceptor");
let TypesController = class TypesController {
    constructor(typesService) {
        this.typesService = typesService;
    }
    async getTypes() {
        return await this.typesService.getTypes();
    }
    async createType(typeDto) {
        const type = await this.typesService.createType(typeDto);
        return {
            message: constants_1.typeCreated,
            type,
        };
    }
    async getType(id) {
        return await this.typesService.getType(id);
    }
    async updateType(typeDto, id) {
        await this.typesService.updateType(typeDto, id);
    }
};
exports.TypesController = TypesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TypesController.prototype, "getTypes", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, form_data_interceptor_1.FormDataOnlyInterceptor)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_dto_1.TypeDto]),
    __metadata("design:returntype", Promise)
], TypesController.prototype, "createType", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypesController.prototype, "getType", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [type_dto_1.TypeDto, String]),
    __metadata("design:returntype", Promise)
], TypesController.prototype, "updateType", null);
exports.TypesController = TypesController = __decorate([
    (0, common_1.Controller)('types'),
    __metadata("design:paramtypes", [types_service_1.TypesService])
], TypesController);
//# sourceMappingURL=types.controller.js.map