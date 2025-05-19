"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadInterceptor = void 0;
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const device_exceptions_1 = require("../../exceptions/device.exceptions");
const common_1 = require("@nestjs/common");
const FileUploadInterceptor = (options) => {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: options.maxSize },
        fileFilter: (req, file, callback) => {
            if (!options.allowedTypes?.includes(file.mimetype)) {
                return callback(new device_exceptions_1.WrongFileType(), false);
            }
            if (file.size > options.maxSize) {
                return callback(new device_exceptions_1.WrongFileSize(), false);
            }
            callback(null, true);
        },
    })));
};
exports.FileUploadInterceptor = FileUploadInterceptor;
//# sourceMappingURL=file-upload.interceptor.js.map