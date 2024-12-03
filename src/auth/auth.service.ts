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

  async getTokens(user_id: string, email: string): Promise<Tokens> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user_id,
          email,
        },
        {
        secret: 'access-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user_id,
          email,
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
  }

  async signup(authDto: UserDto) {
    console.log(authDto);
    const newUser = await this.prisma.user.create({
      data: authDto,
    });

    return newUser;
  }

  async signin(authDto: AuthDto): Promise<any> {
    const user: UserDto = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access denied');
    const userDBPassword = await this.prisma.password.findMany({
        where: {
            user_id: user.user_id,
        },
    });
    const isMatch = await bcrypt.compare(
        authDto.password,
        userDBPassword[0].password,
    );
    if (!isMatch) throw new UnauthorizedException();
    console.log('ffsdff');
    
    const tokens:Tokens = await this.getTokens(user.user_id, user.email);
    await this.prisma.token.updateMany({
        where: {
            user_id: user.user_id
        },
        data: {
            user_id: user.user_id,
            refresh_token: tokens.refresh_token
        }
    });
    return tokens


    // if (user) {
    //     const userDBPassword = await this.prisma.password.findMany({
    //         where: {
    //           user_id: user.user_id,
    //         },
    //     });
    //     const isMatch = await bcrypt.compare(
    //         authDto.password,
    //         userDBPassword[0].password,
    //     );
    // }
    
    // const existToken = await this.prisma.token.findMany({
    //   where: {
    //     user_id: user.user_id,
    //   },
    // });
    

    // if (isMatch && !existToken[0]) {
    //   const tokens:Tokens = await this.getTokens(user.user_id, user.email);
    //   await this.prisma.token.create({
    //     data: {
    //         refresh_token: tokens.refresh_token
    //     }
    // });
    //    return tokens
    // } else {
    //   throw new UnauthorizedException();
    // }
  }
  async refreshToken() {}
  async logout() {}
}
