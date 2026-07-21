export class RolePermissionsResponseDto {
  roleId: string;
  roleName: string;
  locationId: string | null;
  locationName: string | null;
  warehouseId: string | null;
  warehouseName: string | null;
  permissionIds: string[];
  permissionsName: string[];
  comment: string | null;

  constructor(partial: Partial<RolePermissionsResponseDto>) {
    Object.assign(this, {
      roleId: '',
      roleName: '',
      locationId: null,
      locationName: null,
      warehouseId: null,
      warehouseName: null,
      permissionIds: [],
      permissionsName: [],
      comment: null,
      ...partial,
    });
  }
}
