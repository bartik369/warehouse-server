import { IUser } from '../users/dtos/user.dto';
import { AuthDto } from './dtos/auth.dto';
import { AuthData, Tokens, GroupAuthData } from 'src/common/types/user.types';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signin(authDto: AuthDto): Promise<GroupAuthData>;
    logout(id: string): Promise<boolean>;
    refreshToken(token: string): Promise<AuthData>;
    validate(token: string): Promise<IUser>;
    updateRefreshHash(userId: string, refreshToken: string): Promise<void>;
    getTokens(id: string, email: string, login: string): Promise<Tokens>;
    hashData(data: string): Promise<string>;
}
