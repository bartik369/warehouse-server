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
import { generateCsrfToken } from 'src/common/utils/secure/csrf.util';
import { successLogoutMsg } from 'src/common/utils/constants';
import { UserBaseDto } from '../users/dtos/user-base.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SIGNIN
  @UseInterceptors(SetCookiesInterceptor)
  @UsePipes(new ValidationPipe())
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() authDto: AuthDto,
  ): Promise<AuthData & { csrfToken: string }> {
    const data: GroupAuthData = await this.authService.signin(authDto);
    if (data?.tokens?.refreshToken) {
      const csrfToken = generateCsrfToken();
      console.log(csrfToken);
      return {
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        csrfToken,
      };
    }
  }

  @UseInterceptors(SetCookiesInterceptor)
  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request): Promise<any> {
    const token: string = req.cookies.refreshToken;
    const { user, accessToken, refreshToken } =
      await this.authService.refreshToken(token);
    return { user, accessToken, refreshToken };
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
  async validate(@GetAccessToken() token: string): Promise<UserBaseDto> {
    return await this.authService.validate(token);
  }
}
