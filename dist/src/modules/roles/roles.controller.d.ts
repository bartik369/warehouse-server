import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import { IRole } from './types/role.types';
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    getRoles(): Promise<IRole[]>;
    getAssignableRoles(): Promise<IRole[]>;
    getRole(id: string): Promise<IRole>;
    createRole(roleDto: RoleDto): Promise<{
        message: string;
        role: IRole;
    }>;
    updateRole(id: string, roleDto: RoleDto): Promise<{
        message: string;
        updatedRole: IRole;
    }>;
    deleteRole(id: string): Promise<{
        message: string;
    }>;
}
