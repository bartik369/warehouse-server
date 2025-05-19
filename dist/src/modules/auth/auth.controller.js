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
exports.AuthController = void 0;
const auth_dto_1 = require("./dtos/auth.dto");
const auth_service_1 = require("./auth.service");
const public_decorator_1 = require("./decorators/public.decorator");
const user_id_decorator_1 = require("./decorators/user-id.decorator");
const common_1 = require("@nestjs/common");
const access_token_decorator_1 = require("./decorators/access-token.decorator");
const SetCookiesInterceptor_1 = require("./interceptors/SetCookiesInterceptor");
const ClearCookiesInterceptor_1 = require("./interceptors/ClearCookiesInterceptor");
const constants_1 = require("../../common/utils/constants");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signin(authDto) {
        const data = await this.authService.signin(authDto);
        if (data?.tokens?.refreshToken) {
            return {
                user: data.user,
                accessToken: data.tokens.accessToken,
                refreshToken: data.tokens.refreshToken,
            };
        }
    }
    async refreshToken(req) {
        const token = req.cookies.refreshToken;
        return await this.authService.refreshToken(token);
    }
    async logout(userId) {
        await this.authService.logout(userId);
        return { message: constants_1.successLogoutMsg };
    }
    async validate(token) {
        return await this.authService.validate(token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseInterceptors)(SetCookiesInterceptor_1.SetCookiesInterceptor),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('refresh'),
    (0, common_1.UseInterceptors)(ClearCookiesInterceptor_1.ClearCookiesInterceptor),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseInterceptors)(ClearCookiesInterceptor_1.ClearCookiesInterceptor),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, user_id_decorator_1.GetUserId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, access_token_decorator_1.GetAccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validate", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map