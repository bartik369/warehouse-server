"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCookiesInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ClearCookiesInterceptor = class ClearCookiesInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        return next.handle().pipe((0, rxjs_1.tap)(() => {
            response.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: 'strict',
            });
        }));
    }
};
exports.ClearCookiesInterceptor = ClearCookiesInterceptor;
exports.ClearCookiesInterceptor = ClearCookiesInterceptor = __decorate([
    (0, common_1.Injectable)()
], ClearCookiesInterceptor);
//# sourceMappingURL=ClearCookiesInterceptor.js.map