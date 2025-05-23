import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsDto } from './dtos/role-permissions.dto';
export declare class RolePermissionsController {
    private rolePermissionsService;
    constructor(rolePermissionsService: RolePermissionsService);
    getRolePermissions(): Promise<{
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
    createRolePermissions(rolePermissionsDto: RolePermissionsDto): Promise<{
        message: string;
    }>;
    updateRolePermissions(rolePermissionsDto: RolePermissionsDto): Promise<{
        message: string;
    }>;
}
