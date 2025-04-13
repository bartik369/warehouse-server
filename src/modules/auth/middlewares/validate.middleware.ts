import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { JwtPayload } from 'src/common/types/user.types';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ValidateAccessMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = this.extractTokenFromHeader(req);
    if (!token) throw new UnauthorizedException();
    try {
      const validate: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      if (!validate) throw new UnauthorizedException();
      const user = await this.prisma.user.findUnique({
        where: { id: validate.sub },
      });
      if (!user) throw new UnauthorizedException();
      req.user = user;
      next();
    } catch (error) {
      console.error('[ValidateAccessMiddleware]', error);
      throw new UnauthorizedException('Access token is invalid or expired');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
