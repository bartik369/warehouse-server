import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { NestMiddleware } from '@nestjs/common';
export declare class ValidateAccessMiddleware implements NestMiddleware {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    private extractTokenFromHeader;
}
