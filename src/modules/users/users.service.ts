import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ConflictUserException } from 'src/exceptions/auth.exceptions';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserBaseDto } from './dtos/user-base.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<UserBaseDto> {
    const existUser = await this.prisma.user.findUnique({
      where: { email: userDto.email },
    });
    if (existUser) throw new ConflictUserException();

    const password = uuidv4();
    const hash = await bcrypt.hash(password, 9);
    const user = await this.prisma.user.create({
      data: {
        ...userDto,
        workId: userDto.workId || null,
        departmentId: userDto.departmentId || null,
        locationId: userDto.locationId || null,
      },
    });
    const [userPassword, userToken] = await Promise.all([
      this.prisma.password.create({
        data: {
          userId: user.id,
          password: hash,
        },
      }),
      this.prisma.token.create({
        data: {
          userId: user.id,
          token: '',
        },
      }),
    ]);
    if (!userPassword || !userToken)
      throw new InternalServerErrorException(
        'Failed to create password or token',
      );
    return user;
  }

  async findAll(): Promise<UserBaseDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        location: {
          select: { name: true },
        },
        department: {
          select: { name: true },
        },
      },
    });

    return users.map(({ department, location, ...user }) => ({
      ...user,
      department: department?.name,
      location: location?.name,
    }));
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  // update(id: number, userDto: UserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: string) {
  //   await this.prisma.password.delete({
  //     where: {
  //       id: userDto.id,
  //     },
  //   });
  //   await this.prisma.user.delete({
  //     where: {
  //       id: userDto.id,
  //     },
  //   });
  // }
}
