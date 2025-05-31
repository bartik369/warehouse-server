import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserBaseDto } from './dtos/user-base.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userDto: CreateUserDto): Promise<UserBaseDto>;
    findAll(): string;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__userClient<{
        id: string;
        locationId: string;
        createdAt: Date;
        updatedAt: Date;
        userName: string;
        email: string;
        workId: string | null;
        firstNameEn: string;
        lastNameEn: string;
        isActive: boolean;
        firstNameRu: string;
        lastNameRu: string;
        departmentId: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
