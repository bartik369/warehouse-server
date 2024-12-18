import { AuthData, Tokens } from 'src/types/user.types';
import { User} from './../users/dto/user.dto';
import { GroupAuthData } from 'src/types/user.types';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, UnauthorizedException, Injectable } from '@nestjs/common';
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
    
    if (!existUser || !existToken) throw new ForbiddenException();

    const matchRefreshToken = await bcrypt.compare(token, existToken.refreshToken);

    if(!matchRefreshToken) throw new ForbiddenException();
    
    const tokens = await this.getTokens(existUser.id, existUser.email, existUser.login);
    await this.updateRefreshHash(existUser.id, tokens.refreshToken)
    return {token: tokens.accessToken, user: existUser}
  };

  async logout(id: string):Promise<boolean> {
    await this.prisma.token.update({
      where: {
        userId: id
      },
      data: {
        refreshToken: '',
      }
    });
    return true;
  }

  async validate(token: string):Promise<User> {
    const payload = await this.jwtService.decode(token);

    if (!payload) throw new UnauthorizedException();
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    });

    if (!user) throw new UnauthorizedException();
    console.log(user);
    
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
