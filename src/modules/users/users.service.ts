import { PrismaService } from 'prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userDto: UserDto) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        email: userDto.email,
      },
    });
    if (existUser)
      throw new ConflictException('Something went wrong', {
        cause: new Error(),
        description: 'Please, check your credentials',
      });
    const password = uuidv4();
    const hash = await bcrypt.hash(password, 9);
    const user = await this.prisma.user.create({
      data: userDto,
    });

    await this.prisma.password.create({
      data: {
        userId: user.id,
        password: hash,
      },
    });
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: '',
      },
    });

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, userDto: UserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    await this.prisma.password.delete({
      where: {
        id: id,
      },
    });
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
