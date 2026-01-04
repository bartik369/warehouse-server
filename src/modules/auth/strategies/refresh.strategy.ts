import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/types/user.types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.refreshToken]),
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
    });
  }
  validate(payload: JwtPayload): JwtPayload {
    if (!payload?.sub) {
      throw new ForbiddenException('Invalid refresh token payload');
    }
    return payload;
  }
}
