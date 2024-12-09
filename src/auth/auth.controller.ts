import { Auth } from './dto/auth.dto';
import { GroupAuthData, AuthData } from 'src/types/user.types';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Body, Controller, Post, Res } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
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
      accessToken: data.tokens.accessToken
    }
  }

  @Post('/refresh')
  refreshToken(@Body() authDto: Auth) {
    return this.authService.refreshToken(authDto)
  }
  
  @Post('/logout')
  logout(@Body() id: string) {
    return this.authService.logout(id)
  }

}
