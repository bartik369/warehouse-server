import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersQueryDto } from './dtos/get-users.dto';
import { SortedUserDto, UserBaseDto } from './dtos/user-base.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() userDto: CreateUserDto): Promise<{ message: string; user: UserBaseDto }> {
    const user = await this.usersService.create(userDto);
    return {
      message: 'rerwerw', // todo изменить контракт
      user,
    };
  }

  @Get('/search')
  async getUsers(@Query() query: GetUsersQueryDto): Promise<SortedUserDto> {
    return await this.usersService.searchUsers(query);
  }

  @Get('/search/sorted')
  async findSortedUsers(@Query('search') search: string): Promise<UserBaseDto[]> {
    return await this.usersService.findSortedUsers(search);
  }

  @Get()
  async findAll(): Promise<UserBaseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserBaseDto> {
    return this.usersService.findOne(id);
  }

  @Get('/profile/:id')
  async getProfile(@Param('id') id: string) {
    return await this.usersService.getProfile(id);
  }
}
