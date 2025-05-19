import { AuthDto } from './dtos/auth.dto';
import { AuthData } from 'src/common/types/user.types';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { IUser } from '../users/dtos/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signin(authDto: AuthDto): Promise<AuthData>;
    refreshToken(req: Request): Promise<any>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    validate(token: string): Promise<IUser>;
}
