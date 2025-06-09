import { UserBaseDto } from 'src/modules/users/dtos/user-base.dto';

export class RolesListResponseDto {
  user: UserBaseDto;
  roles: {
    roleId: string;
    locationName: string;
    warehouseName: string;
    roleName: string;
    permissionsName: string[];
  }[];
}
