export type GroupedResponse = {
  roleId: string;
  roleName: string;
  comment: string | null;
  locationId: string | null;
  locationName: string | null;
  warehouseId: string | null;
  warehouseName: string | null;
  permissionIds: Set<string>;
  permissionsName: Set<string>;
};
