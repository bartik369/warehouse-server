import { AuthData, Tokens } from 'src/common/types/user.types';
import { User} from '../users/dtos/user.dto';
import { GroupAuthData } from 'src/common/types/user.types';
import { AuthDto } from './dtos/auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { DeniedAccessExeption } from 'src/exceptions/auth.exceptions';
import { Injectable } from '@nestjs/common';
import { UserNotFoundExeption } from 'src/exceptions/auth.exceptions';
import * as bcrypt from 'bcrypt';

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
    if (!user) throw new UserNotFoundExeption();

    const userDBPassword = await this.prisma.password.findUnique({
        where: {
            userId: user.id
        },
    });
    const isMatch = await bcrypt.compare(
        authDto.password,
        userDBPassword.password,
    );
    if (!isMatch) throw new UserNotFoundExeption();

    const tokens:Tokens = await this.getTokens(user.id, user.email, user.userName);
    await this.updateRefreshHash(user.id, tokens.refreshToken)
    return {
      user: user,
      tokens: tokens
    }
  };

  async refreshToken(token:string):Promise<AuthData> {
    const validToken = await this.jwtService.verifyAsync(
      token, 
      {
        secret: process.env.JWT_REFRESH_SECRET
      }
    );
    const existUser = await this.prisma.user.findUnique({
      where: {
        id: validToken.sub
      }
    });
    const existToken = await this.prisma.token.findUnique({
      where: {
        userId: existUser.id,
      }
    });
    if (!existUser || !existToken) throw new DeniedAccessExeption();

    const matchRefreshToken = await bcrypt.compare(token, existToken.token);
    if(!matchRefreshToken) throw new DeniedAccessExeption();
    
    const tokens = await this.getTokens(existUser.id, existUser.email, existUser.userName);
    await this.updateRefreshHash(existUser.id, tokens.refreshToken);
    return {token: tokens.accessToken, user: existUser}
  };

  async logout(id: string):Promise<boolean> {
    await this.prisma.token.update({
      where: {
        userId: id
      },
      data: {
        token: '',
      }
    });
    return true;
  }

  async validate(token: string):Promise<User> {
    const payload = await this.jwtService.decode(token);
    if (!payload) throw new DeniedAccessExeption();

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    });
    if (!user) throw new DeniedAccessExeption();

    return user;
  }

   // Updating refresh token in token table
   async updateRefreshHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.token.updateMany({
      where: {
        userId: userId
      },
      data: {
        token: hash
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
          expiresIn: 60 * 10,
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
