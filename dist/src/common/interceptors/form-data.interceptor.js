"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDataOnlyInterceptor = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const FormDataOnlyInterceptor = () => {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (_, __, cb) => cb(null, true),
    })));
};
exports.FormDataOnlyInterceptor = FormDataOnlyInterceptor;
//# sourceMappingURL=form-data.interceptor.js.map