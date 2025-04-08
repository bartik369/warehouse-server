import { User } from '../users/dtos/user.dto';
import { AuthDto } from './dtos/auth.dto';
import { AuthData, Tokens, GroupAuthData } from 'src/common/types/user.types';
import { PrismaService } from 'prisma/prisma.service';
import {
  DeniedAccessException,
  UnauthorizeException,
} from 'src/exceptions/auth.exceptions';
import { UserNotFoundException } from 'src/exceptions/auth.exceptions';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  // SIGNIN
  async signin(authDto: AuthDto): Promise<GroupAuthData> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email?.trim(),
      },
    });
    if (!user) throw new UserNotFoundException();

    const userDBPassword = await this.prisma.password.findUnique({
      where: {
        userId: user.id,
      },
    });
    const isMatch = await bcrypt.compare(
      authDto.password,
      userDBPassword.password,
    );
    if (!isMatch) throw new UserNotFoundException();

    const tokens: Tokens = await this.getTokens(
      user.id,
      user.email,
      user.userName,
    );
    await this.updateRefreshHash(user.id, tokens.refreshToken);
    return {
      user: user,
      tokens: tokens,
    };
  }

  async logout(id: string): Promise<boolean> {
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
  // REFRESH TOKEN
  async refreshToken(token: string): Promise<AuthData> {
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
      if (!existUser || !existToken) throw new DeniedAccessException();

      const matchRefreshToken = await bcrypt.compare(token, existToken.token);
      if (!matchRefreshToken) throw new DeniedAccessException();
      const tokens = await this.getTokens(
        existUser.id,
        existUser.email,
        existUser.userName,
      );
      await this.updateRefreshHash(existUser.id, tokens.refreshToken);
      return {
        accessToken: tokens.accessToken,
        user: existUser,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizeException();
      }
      throw new DeniedAccessException();
    }
  }

  async validate(token: string): Promise<User> {
    const payload = await this.jwtService.decode(token);
    if (!payload) throw new DeniedAccessException();

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) throw new DeniedAccessException();

    return user;
  }

  // Updating refresh token in token table
  async updateRefreshHash(userId: string, refreshToken: string) {
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

  // Utility functions
  async getTokens(id: string, email: string, login: string): Promise<Tokens> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          userEmail: email,
          userLogin: login,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: 60 * 60 * 24,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          userEmail: email,
          userLogin: login,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: 60 * 60 * 24 * 14,
        },
      ),
    ]);
    return {
      accessToken: access,
      refreshToken: refresh,
    };
  }

  hashData(data: string) {
    return bcrypt.hash(data, 9);
  }
}
