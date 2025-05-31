import { UsersService } from './users.service';
import { UserBaseDto } from './dtos/user-base.dto';
import { CreateUserDto } from './dtos/create-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(userDto: CreateUserDto): Promise<{
        message: string;
        user: UserBaseDto;
    }>;
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
