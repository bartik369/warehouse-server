import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){};

  async create(userDto: UserDto) {
    const saltOrRounds = 10;
    const password = uuidv4();
    console.log(password);
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = await this.prisma.user.create({
     data: userDto
    });
    await this.prisma.password.create({
      data: {
        user_id: user.user_id,
        password: hash,
      }
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        user_id: id,
      }
    })
  }

  update(id: number, userDto: UserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    await this.prisma.password.deleteMany({
      where: {
        user_id: id
      }
    });
    await this.prisma.user.delete({
      where: {
        user_id: id
      }
    });
  }
}
