import { ClearCookies } from '@nestjsplus/cookies';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from './dto/auth.dto';
import { GroupAuthData, AuthData, Tokens } from 'src/types/user.types';
import { AuthService } from './auth.service';
import { response, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { RefreshTokenGuard } from 'src/guards';
import { Body, Controller, HttpCode, Post, Res, HttpStatus, UseGuards } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Res({passthrough: true}) res: Response,
    @Body() authDto: Auth):Promise<AuthData> {
    const data:GroupAuthData = await this.authService.signin(authDto)
    res.cookie('refreshToken', data.tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    return  {
      user: data.user,
      token: data.tokens.accessToken
    }
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() id: string,
    @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
    console.log('refresh start');
    return this.authService.refreshToken(id, refreshToken)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() id: string,
    @Res({ passthrough: true }) res:any) {
    res.clearCookie('refreshToken')
    return this.authService.logout(id)
  }

}
