import { UserDto } from './../users/dto/user.dto';
import { AuthGuard } from './auth.guard';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/token.types';
import { AuthService } from './auth.service';
import { Get, Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  signup(@Body() authDto: UserDto) {
    return this.authService.signup(authDto)
  }

  @Post('/signin')
  signin(@Body() authDto: AuthDto):Promise<Tokens> {
    return this.authService.signin(authDto)
  }
  @Post('/refresh')
  refreshToken(@Body()authDto: AuthDto) {

  }
  @Post('/logout')
  logout(@Body() authDto: AuthDto) {

  }

}
