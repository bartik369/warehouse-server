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
exports.AuthService = void 0;
const prisma_service_1 = require("../../../prisma/prisma.service");
const auth_exceptions_1 = require("../../exceptions/auth.exceptions");
const auth_exceptions_2 = require("../../exceptions/auth.exceptions");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async signin(authDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: authDto.email?.trim(),
            },
        });
        if (!user)
            throw new auth_exceptions_2.UserNotFoundException();
        const userDBPassword = await this.prisma.password.findUnique({
            where: {
                userId: user.id,
            },
        });
        const isMatch = await bcrypt.compare(authDto.password, userDBPassword.password);
        if (!isMatch)
            throw new auth_exceptions_2.UserNotFoundException();
        const tokens = await this.getTokens(user.id, user.email, user.userName);
        await this.updateRefreshHash(user.id, tokens.refreshToken);
        return {
            user: user,
            tokens: tokens,
        };
    }
    async logout(id) {
        await this.prisma.token.update({
            where: {
                userId: id,
            },
            data: {
                token: '',
            },
        });
        return true;
    }
    async refreshToken(token) {
        try {
            const validToken = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const existUser = await this.prisma.user.findUnique({
                where: { id: validToken.sub },
            });
            const existToken = await this.prisma.token.findUnique({
                where: { userId: existUser.id },
            });
            if (!existUser || !existToken)
                throw new auth_exceptions_1.DeniedAccessException();
            const matchRefreshToken = await bcrypt.compare(token, existToken.token);
            if (!matchRefreshToken)
                throw new auth_exceptions_1.DeniedAccessException();
            const tokens = await this.getTokens(existUser.id, existUser.email, existUser.userName);
            await this.updateRefreshHash(existUser.id, tokens.refreshToken);
            return {
                accessToken: tokens.accessToken,
                user: existUser,
                refreshToken: tokens.refreshToken,
            };
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new auth_exceptions_1.UnauthorizeException();
            }
            throw new auth_exceptions_1.DeniedAccessException();
        }
    }
    async validate(token) {
        const payload = await this.jwtService.decode(token);
        if (!payload)
            throw new auth_exceptions_1.DeniedAccessException();
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        if (!user)
            throw new auth_exceptions_1.DeniedAccessException();
        return user;
    }
    async updateRefreshHash(userId, refreshToken) {
        const hash = await this.hashData(refreshToken);
        await this.prisma.token.updateMany({
            where: {
                userId: userId,
            },
            data: {
                token: hash,
            },
        });
    }
    async getTokens(id, email, login) {
        const [access, refresh] = await Promise.all([
            this.jwtService.signAsync({
                sub: id,
                userEmail: email,
                userLogin: login,
            }, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: 60 * 60 * 24,
            }),
            this.jwtService.signAsync({
                sub: id,
                userEmail: email,
                userLogin: login,
            }, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: 60 * 60 * 24 * 14,
            }),
        ]);
        return {
            accessToken: access,
            refreshToken: refresh,
        };
    }
    hashData(data) {
        return bcrypt.hash(data, 9);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map