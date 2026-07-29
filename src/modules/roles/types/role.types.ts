export interface IRole {
  id: string;
  comment: string | null;
  name: string;
}

export type RoleListItem = {
  roleId: string;
  roleName: string;
  locationId: string | null;
  locationName: string | null;
  warehouseId: string | null;
  warehouseName: string | null;
  permissionIds: Set<string>;
  permissionsName: Set<string>;
};

export type PermissionInfo = {
  id: string;
  name: string;
};
