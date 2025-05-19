export declare class RolePermissionsDto {
    id: string;
    roleId: string;
    permissionIds: string[] | null;
    roleName: string;
    warehouseId: string;
    oldWarehouseId: string;
    locationId: string;
    oldLocationId: string;
    comment: string;
}
export declare class RolePermissionsResponseDto {
    id: string;
    roleId: string;
    permissionIds: string[];
    permissionName: string[];
    locationId: string;
    locationName: string;
    warehouseId: string;
    warehouseName: string;
    comment: string;
    constructor(partial: Partial<RolePermissionsResponseDto>);
}
