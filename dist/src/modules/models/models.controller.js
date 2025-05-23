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
exports.ModelsController = void 0;
const common_1 = require("@nestjs/common");
const models_service_1 = require("./models.service");
const file_upload_interceptor_1 = require("../../common/interceptors/file-upload.interceptor");
const constants_1 = require("../../common/utils/constants");
const model_dto_1 = require("./dto/model.dto");
const class_transformer_1 = require("class-transformer");
let ModelsController = class ModelsController {
    constructor(modelsService) {
        this.modelsService = modelsService;
    }
    async getModelById(id) {
        const model = await this.modelsService.getModelById(id);
        return model;
    }
    async getModels(manufacturer, type) {
        return await this.modelsService.getModels(manufacturer, type);
    }
    async getAllModels() {
        return await this.modelsService.getAllModels();
    }
    async createModel(file, body) {
        const modelDto = (0, class_transformer_1.plainToInstance)(model_dto_1.ModelDto, body);
        const model = await this.modelsService.createModel(modelDto, file);
        return {
            message: constants_1.modelCreated,
            model,
        };
    }
    async updateModel(file, body) {
        const modelDto = (0, class_transformer_1.plainToInstance)(model_dto_1.ModelDto, body);
        const updatedModel = await this.modelsService.updateModel(modelDto, file);
        return {
            message: constants_1.modelUpdated,
            updatedModel,
        };
    }
};
exports.ModelsController = ModelsController;
__decorate([
    (0, common_1.Get)('/single/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "getModelById", null);
__decorate([
    (0, common_1.Get)('/united/:manufacturer/:type'),
    __param(0, (0, common_1.Param)('manufacturer')),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "getModels", null);
__decorate([
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "getAllModels", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, file_upload_interceptor_1.FileUploadInterceptor)(constants_1.allowedPictureOptions),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "createModel", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, file_upload_interceptor_1.FileUploadInterceptor)(constants_1.allowedPictureOptions),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ModelsController.prototype, "updateModel", null);
exports.ModelsController = ModelsController = __decorate([
    (0, common_1.Controller)('models'),
    __metadata("design:paramtypes", [models_service_1.ModelsService])
], ModelsController);
//# sourceMappingURL=models.controller.js.map