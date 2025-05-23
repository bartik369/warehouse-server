import { PrismaService } from 'prisma/prisma.service';
import { RolePermissionsDto } from './dtos/role-permissions.dto';
export declare class RolePermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllRolesPermissions(): Promise<{
        roleId: string;
        roleName: string;
        comment: string;
        warehouseName: string;
        warehouseId: string;
        locationName: string;
        locationId: string;
        permissionName: string[];
        permissionIds: string[];
    }[]>;
    createUpdateRolePermissions(rolePermissionsDto: RolePermissionsDto): Promise<void>;
}
