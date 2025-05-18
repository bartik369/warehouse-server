import { AuthDto } from './dtos/auth.dto';
import { GroupAuthData, AuthData } from 'src/common/types/user.types';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { GetUserId } from './decorators/user-id.decorator';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { GetAccessToken } from './decorators/access-token.decorator';
import { SetCookiesInterceptor } from './interceptors/SetCookiesInterceptor';
import { ClearCookiesInterceptor } from './interceptors/ClearCookiesInterceptor';
import { successLogoutMsg } from 'src/common/utils/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SIGNIN
  @UseInterceptors(SetCookiesInterceptor)
  @UsePipes(new ValidationPipe())
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() authDto: AuthDto): Promise<AuthData> {
    const data: GroupAuthData = await this.authService.signin(authDto);
    if (data?.tokens?.refreshToken) {
      return {
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      };
    }
  }
  @Public()
  @Get('refresh')
  @UseInterceptors(ClearCookiesInterceptor)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request): Promise<any> {
    const token: string = req.cookies.refreshToken;
    return await this.authService.refreshToken(token);
  }

  @Post('logout')
  @UseInterceptors(ClearCookiesInterceptor)
  @HttpCode(HttpStatus.OK)
  async logout(@GetUserId() userId: string) {
    await this.authService.logout(userId);
    return { message: successLogoutMsg };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@GetAccessToken() token: string) {
    return await this.authService.validate(token);
  }
}
