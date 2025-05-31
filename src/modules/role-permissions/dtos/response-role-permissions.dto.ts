export class RolePermissionsResponseDto {
  id: string;
  roleId: string;
  permissionIds: string[];
  permissionName: string[];
  locationId: string;
  locationName: string;
  warehouseId: string;
  warehouseName: string;
  comment: string;

  constructor(partial: Partial<RolePermissionsResponseDto>) {
    Object.assign(this, {
      id: '',
      permissionIds: [],
      permissionName: [],
      locationId: '',
      locationName: '',
      warehouseId: '',
      warehouseName: '',
      comment: '',
      ...partial,
    });
  }
}
