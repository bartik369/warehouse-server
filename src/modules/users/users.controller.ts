import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserBaseDto } from './dtos/user-base.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() userDto: CreateUserDto,
  ): Promise<{ message: string; user: UserBaseDto }> {
    console.log(userDto)
    const user = await this.usersService.create(userDto);
    return {
      message: 'rerwerw',
      user,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

}
