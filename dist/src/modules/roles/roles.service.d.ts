import { PrismaService } from 'prisma/prisma.service';
import { RoleDto } from './dto/role.dto';
import { IRole } from './types/role.types';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    getRoles(): Promise<IRole[]>;
    getRole(id: string): Promise<IRole>;
    getAssignableRoles(): Promise<IRole[]>;
    createRole(roleDto: RoleDto): Promise<{
        id: string;
        name: string;
        comment: string | null;
    }>;
    updateRole(id: string, roleDto: RoleDto): Promise<IRole>;
    deleteRole(id: string): Promise<void>;
}
