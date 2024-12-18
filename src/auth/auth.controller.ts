import { Auth } from './dto/auth.dto';
import { GroupAuthData, AuthData} from 'src/types/user.types';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { GetUserId } from './decorators/user-id.decorator';
import { Body, Controller, HttpCode, Post, Get, Req, Res, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetAccessToken } from './decorators/access-token.decorator';

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
    });
    return  {
      user: data.user,
      token: data.tokens.accessToken
    };
  }
  
  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request):Promise<any> {
    const token:string = req.cookies.refreshToken;
    return await this.authService.refreshToken(token);
  };

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetUserId() userId: string,
    @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(userId)
    res.clearCookie('refreshToken');
  };

  @Get('validate')
  @HttpCode(HttpStatus.OK)
  async validate(
    @GetAccessToken() token: string){
      return await this.authService.validate(token);
  };
}
