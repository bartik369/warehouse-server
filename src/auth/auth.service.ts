import { Tokens } from 'src/types/user.types';
import { UserDto } from './../users/dto/user.dto';
import { GroupAuthData } from 'src/types/user.types';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signin(authDto: AuthDto): Promise<GroupAuthData> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Something went wrong', {
        cause: new Error(),
        description:'Please, check your credentials',
    });

    const userDBPassword = await this.prisma.password.findUnique({
        where: {
            userId: user.id
        },
    });

    const isMatch = await bcrypt.compare(
        authDto.password,
        userDBPassword.password,
    );

    if (!isMatch) throw new UnauthorizedException('Something went wrong', {
        cause: new Error(),
        description:'Please, check your credentials',
    });

    const tokens:Tokens = await this.getTokens(user.id, user.email, user.login);
    await this.updateRefreshHash(user.id, tokens.refreshToken)
    return {
      user: user,
      tokens: tokens
    }
  }


  async refreshToken(id: string, refreshToken: string):Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });
    const token = await this.prisma.token.findUnique({
      where: {
        userId: user.id
      }
    })
    if (!user || !token) throw new ForbiddenException();

    const matchRToken = await bcrypt.compare(refreshToken, token.refreshToken)
    if (!matchRToken) throw new ForbiddenException();
    const tokens = await this.getTokens(user.id, user.email, user.login);
    await this.updateRefreshHash(user.id, tokens.refreshToken)
    return tokens

  }
  async logout(id: string) {
    await this.prisma.token.update({
      where: {
        userId: id
      },
      data: {
        refreshToken: ''
      }
    })
  }

   // Updating refresh token in token table
   async updateRefreshHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.token.updateMany({
      where: {
        userId: userId
      },
      data: {
        refreshToken: hash
      }
    })
  }


    // Utility functions

  async getTokens(id: string, email:string, login:string): Promise<Tokens> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        {
            sub: id,
            userEmail: email,
            userLogin: login,
        },
        {
        secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: 60 * 1,
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
          expiresIn: 60 * 15 * 24 * 7,
        },
      ),
    ]);
    return {
        accessToken: access,
        refreshToken: refresh,
    }
  };

  hashData(data: string) {
    return bcrypt.hash(data, 9);
  };
}
