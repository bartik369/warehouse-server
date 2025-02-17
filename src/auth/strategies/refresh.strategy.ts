import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayloadWithRt } from 'src/types/user.types';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }
    validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        console.log(refreshToken);
        
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        return {
            ...payload,
            refreshToken,
        }
    }
}