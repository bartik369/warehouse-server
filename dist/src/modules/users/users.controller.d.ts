import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(userDto: UserDto): void;
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
    update(id: string, userDto: UserDto): string;
    remove(id: string): Promise<void>;
}
