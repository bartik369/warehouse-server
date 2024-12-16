import { UserDto } from './../users/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from './dto/auth.dto';
import { GroupAuthData, AuthData, Tokens } from 'src/types/user.types';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { GetUserId } from './decorators/user-id.decorator';
import { RefreshTokenGuard } from 'src/guards';
import { Body, Controller, HttpCode, Post, Get, Req, Res, HttpStatus, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Public()
  @Post('signin')
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

  // @Public()
  // @UseGuards(AuthGuard('jwt-refresh'))
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // refreshToken(
  //   @GetCurrentUserId() id: string,
  //   @GetCurrentUser('refreshToken') refreshToken: string): Promise<Tokens> {
  //   return this.authService.refreshToken(id, refreshToken)
  // }

  

  @Public()
  // @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request):Promise<any>{
    const token:string = req.cookies.refreshToken;
    return await this.authService.refreshToken(token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetUserId() userId: string,
    @Res({ passthrough: true }) res:any) {
    await this.authService.logout(userId)
    res.clearCookie('refreshToken');
  }
}
