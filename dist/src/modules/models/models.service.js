"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelsService = void 0;
const fs = __importStar(require("fs"));
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const device_exceptions_1 = require("../../exceptions/device.exceptions");
let ModelsService = class ModelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getModels(manufacturer, type) {
        const existingType = await this.prisma.device_type.findUnique({
            where: { slug: type },
        });
        const existingManufacturer = await this.prisma.manufacturer.findUnique({
            where: { slug: manufacturer },
        });
        if (!existingType || !existingManufacturer)
            throw new device_exceptions_1.ModelNotFoundException();
        const models = await this.prisma.device_model.findMany({
            where: {
                manufacturerId: existingManufacturer.id,
                typeId: existingType.id,
            },
        });
        return models;
    }
    async getModelById(id) {
        const existModel = await this.prisma.device_model.findUnique({
            where: { id: id },
        });
        const [manufacturer, type] = await Promise.all([
            this.prisma.manufacturer.findUnique({
                where: { id: existModel.manufacturerId },
            }),
            this.prisma.device_type.findUnique({
                where: { id: existModel.typeId },
            }),
        ]);
        if (!manufacturer)
            throw new device_exceptions_1.ManufacturerNotFoundException();
        if (!type)
            throw new device_exceptions_1.TypeNotFoundException();
        return {
            ...existModel,
            manufacturer: manufacturer.name,
            type: type.name,
        };
    }
    async getAllModels() {
        const models = await this.prisma.device_model.findMany({});
        return models;
    }
    async createModel(modelDto, file) {
        const existingManufacturer = await this.prisma.manufacturer.findUnique({
            where: { id: modelDto.manufacturerId },
        });
        if (!existingManufacturer)
            throw new device_exceptions_1.ManufacturerNotFoundException();
        const existingModel = await this.prisma.device_model.findFirst({
            where: {
                name: modelDto.name,
                manufacturerId: modelDto.manufacturerId,
            },
        });
        if (existingModel)
            throw new device_exceptions_1.ModelExistsException();
        const savedFilePath = await this.saveFile(modelDto.imagePath, file);
        const model = await this.prisma.device_model.create({
            data: {
                name: modelDto.name?.trim(),
                slug: modelDto.slug?.trim(),
                imagePath: savedFilePath?.trim(),
                manufacturerId: existingManufacturer.id,
                typeId: modelDto.typeId?.trim(),
            },
        });
        return model;
    }
    async updateModel(modelDto, file) {
        const existModel = await this.prisma.device_model.findUnique({
            where: { id: modelDto.id },
        });
        if (!existModel)
            throw new device_exceptions_1.ModelNotFoundException();
        const model = await this.prisma.device_model.update({
            where: { id: existModel.id },
            data: {
                name: modelDto.name?.trim(),
                slug: modelDto.slug?.trim(),
                imagePath: file
                    ? await this.saveFile(existModel.imagePath, file)
                    : existModel.imagePath,
                manufacturerId: modelDto.manufacturerId?.trim(),
                typeId: modelDto.typeId?.trim(),
            },
        });
        return model;
    }
    async saveFile(existFileName, file) {
        const uniqueSuffix = Date.now();
        const fileName = `${file?.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file?.originalname)}`;
        const filePath = `uploads/models/${fileName}`;
        const existFilePath = `uploads/models/${existFileName}`;
        try {
            if (fs.existsSync(existFilePath)) {
                await fs.promises.unlink(existFilePath);
            }
            await fs.promises.writeFile(filePath, file.buffer);
            return fileName;
        }
        catch (error) {
            throw new Error(`Failed to process file: ${error.message}`);
        }
    }
};
exports.ModelsService = ModelsService;
exports.ModelsService = ModelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModelsService);
//# sourceMappingURL=models.service.js.map