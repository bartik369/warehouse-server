import { UserDto } from './dtos/user.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userDto: UserDto): Promise<{
        department: string;
        id: string;
        locationId: string;
        userName: string;
        email: string;
        workId: string | null;
        firstNameRu: string;
        lastNameRu: string;
        firstNameEn: string;
        lastNameEn: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): string;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__userClient<{
        department: string;
        id: string;
        locationId: string;
        userName: string;
        email: string;
        workId: string | null;
        firstNameRu: string;
        lastNameRu: string;
        firstNameEn: string;
        lastNameEn: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, userDto: UserDto): string;
    remove(id: string): Promise<void>;
}
