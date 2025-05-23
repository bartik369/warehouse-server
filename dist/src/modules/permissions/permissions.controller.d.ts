import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permission.dto';
export declare class PermissionsController {
    private permissionsService;
    constructor(permissionsService: PermissionsService);
    getPermissions(): Promise<PermissionDto[]>;
    getPermission(id: string): Promise<PermissionDto>;
    createPermission(permissionDto: PermissionDto): Promise<{
        message: string;
        permission: PermissionDto;
    }>;
    updatePermission(id: string, permissionDto: PermissionDto): Promise<{
        message: string;
        updatedPermission: PermissionDto;
    }>;
    deletePermission(id: string): Promise<{
        message: string;
    }>;
}
