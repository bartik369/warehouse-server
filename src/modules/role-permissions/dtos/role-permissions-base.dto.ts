export class RolePermissionsBaseDto {
  id?: string;
  roleId: string;
  permissionIds: string[] | null;
  roleName: string;
  warehouseId: string;
  oldWarehouseId?: string;
  locationId: string;
  oldLocationId?: string;
  comment: string;
}
