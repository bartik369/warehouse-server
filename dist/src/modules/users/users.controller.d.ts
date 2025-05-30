import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
