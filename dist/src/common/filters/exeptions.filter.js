"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
let ExceptionsFilter = class ExceptionsFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const responseMessage = exception.getResponse();
            if (typeof responseMessage === 'object' && responseMessage !== null) {
                const msg = responseMessage;
                message = msg['message'] || message;
            }
            else {
                message = responseMessage;
            }
        }
        else if (exception instanceof library_1.PrismaClientKnownRequestError &&
            exception.code === 'P2025') {
            status = common_1.HttpStatus.NOT_FOUND;
            message = 'Resource not found';
        }
        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.ExceptionsFilter = ExceptionsFilter;
exports.ExceptionsFilter = ExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], ExceptionsFilter);
//# sourceMappingURL=exeptions.filter.js.map