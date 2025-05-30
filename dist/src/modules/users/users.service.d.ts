import { UserDto } from './dtos/user.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userDto: UserDto): Promise<{
        id: string;
        userName: string;
        email: string;
        workId: string | null;
        firstNameEn: string;
        lastNameEn: string;
        isActive: boolean;
        locationId: string;
        createdAt: Date;
        updatedAt: Date;
        firstNameRu: string;
        lastNameRu: string;
        departmentId: string | null;
    }>;
    findAll(): string;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__userClient<{
        id: string;
        userName: string;
        email: string;
        workId: string | null;
        firstNameEn: string;
        lastNameEn: string;
        isActive: boolean;
        locationId: string;
        createdAt: Date;
        updatedAt: Date;
        firstNameRu: string;
        lastNameRu: string;
        departmentId: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
