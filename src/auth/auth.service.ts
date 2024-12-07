import { Tokens } from './types/token.types';
import { UserDto } from './../users/dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma.service';
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

  async signin(authDto: AuthDto): Promise<Tokens> {
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
        userDBPassword[0].password,
    );

    if (!isMatch) throw new UnauthorizedException('Something went wrong', {
        cause: new Error(),
        description:'Please, check your credentials',
    });

    const tokens:Tokens = await this.getTokens(user);
    await this.updateRefreshHash(user.id, tokens.refreshToken)
    return tokens
  }

  async refreshToken(authDto: AuthDto) {
    
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

    // Utility functions

  async getTokens(data: Pick<UserDto, 'id' | 'email' | 'login'>): Promise<Tokens> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        {
            userId: data.id,
            userEmail: data.email,
            userLogin: data.login,
        },
        {
        secret: 'access-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
            userId: data.id,
            userEmail: data.email,
            userLogin: data.login,
        },
        {
        secret: 'refresh-secret',
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
