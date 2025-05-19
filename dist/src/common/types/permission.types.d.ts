export interface IRolePermissions {
    id: string;
    roleId: string;
    locationId: string;
    warehouseId: string;
    comment: string;
    createdAt: Date | null;
    permissionId: string[];
}
export interface IRole {
    id: string;
    comment: string | null;
    name: string;
}
