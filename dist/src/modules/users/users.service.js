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
exports.UsersService = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const auth_exceptions_1 = require("../../exceptions/auth.exceptions");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userDto) {
        const existUser = await this.prisma.user.findUnique({
            where: { email: userDto.email },
        });
        if (existUser)
            throw new auth_exceptions_1.ConflictUserException();
        const password = (0, uuid_1.v4)();
        const hash = await bcrypt.hash(password, 9);
        const user = await this.prisma.user.create({
            data: {
                ...userDto,
                workId: userDto.workId || null,
                departmentId: userDto.departmentId || null,
                locationId: userDto.locationId || null,
            },
        });
        const [userPassword, userToken] = await Promise.all([
            this.prisma.password.create({
                data: {
                    userId: user.id,
                    password: hash,
                },
            }),
            this.prisma.token.create({
                data: {
                    userId: user.id,
                    token: '',
                },
            }),
        ]);
        if (!userPassword || !userToken)
            throw new common_1.InternalServerErrorException('Failed to create password or token');
        return user;
    }
    findAll() {
        return `This action returns all users`;
    }
    findOne(id) {
        return this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map