import { JwtPayload } from 'src/common/types/user.types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnauthorizeException } from 'src/exceptions/auth.exceptions';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken,
      ]),
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
    });
  }
  validate(payload: JwtPayload) {
    if (!payload?.sub) {
      throw new UnauthorizeException();
    }
    return payload;
  }
}
