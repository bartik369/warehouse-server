export interface IRolePermissions {
    id: string;
    roleId: string;
    locationId: string;
    warehouseId: string;
    comment: string;
    createdAt: Date | null;
    permissionId: string[];
}
export interface IRolePermission {
    id: string;
    roleId: string;
    locationId: string;
    warehouseId: string;
    comment: string;
    createdAt: Date | null;
    permissionId: string;
}
export interface IPermission {
    id: string;
    name: string;
}
