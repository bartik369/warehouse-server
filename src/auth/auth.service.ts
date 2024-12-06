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
        user_id: userId
      },
      data: {
        refresh_token: hash
      }
    })
  }

  async signin(authDto: AuthDto): Promise<Tokens> {
    const user: UserDto = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Something went wrong', {
        cause: new Error(),
        description:'Please, check your credentials',
    });
    const userDBPassword = await this.prisma.password.findMany({
        where: {
            user_id: user.user_id,
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
    await this.updateRefreshHash(user.user_id, tokens.refresh_token)
    return tokens
  }

  async refreshToken(authDto: AuthDto) {
    
  }
  async logout(id: string) {
    await this.prisma.token.update({
      where: {
        user_id: id
      },
      data: {
        refresh_token: ''
      }
    })
  }

    // Utility functions

  async getTokens(data: Pick<UserDto, 'user_id' | 'email' | 'login'>): Promise<Tokens> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        {
            userId: data.user_id,
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
            userId: data.user_id,
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
        access_token: access,
        refresh_token: refresh,
    }
  };

  hashData(data: string) {
    return bcrypt.hash(data, 9);
  };
}
