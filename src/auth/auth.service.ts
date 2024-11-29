import { UserDto } from './../users/dto/user.dto';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor (private prisma: PrismaService) {}

    async login(authDto: AuthDto) {
        const user: UserDto = await this.prisma.user.findUnique({
            where: {
                login: authDto.login
            }
        });
        const userDBPassword = await this.prisma.password.findMany({
            where: {
                user_id:user.user_id,
            }
        });
        const isMatch = await bcrypt.compare(authDto.password, userDBPassword[0].password);
        if (isMatch) {
            return user
        } else {
            throw new UnauthorizedException()
        }

    }
}
