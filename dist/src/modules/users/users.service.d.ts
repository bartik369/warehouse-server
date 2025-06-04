import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserBaseDto } from './dtos/user-base.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userDto: CreateUserDto): Promise<UserBaseDto>;
    findAll(): Promise<UserBaseDto[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__userClient<{
        locationId: string;
        id: string;
        userName: string;
        email: string;
        workId: string | null;
        firstNameRu: string;
        lastNameRu: string;
        firstNameEn: string;
        lastNameEn: string;
        isActive: boolean;
        departmentId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
