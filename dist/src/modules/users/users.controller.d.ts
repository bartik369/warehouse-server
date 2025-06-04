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
