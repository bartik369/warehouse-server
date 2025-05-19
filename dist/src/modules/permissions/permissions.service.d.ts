import { PrismaService } from 'prisma/prisma.service';
import { PermissionDto } from './dto/permission.dto';
export declare class PermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getPermissions(): Promise<{
        id: string;
        name: string;
        comment: string | null;
    }[]>;
    getPermission(id: string): Promise<PermissionDto>;
    createPermission(permissionDto: PermissionDto): Promise<PermissionDto>;
    updatePermission(id: string, permissionDto: PermissionDto): Promise<PermissionDto>;
    deletePermission(id: string): Promise<void>;
}
