import { DepartmentBaseDto } from 'src/modules/departments/dtos/department-base.dto';
import { LocationBaseDto } from 'src/modules/locations/dtos/location-base.dto';

export class UserBaseDto {
  id: string;
  userName: string;
  email: string;
  workId: string;
  firstNameRu: string;
  lastNameRu: string;
  firstNameEn: string;
  lastNameEn: string;
  isActive: boolean;
  departmentId?: string;
  department?: DepartmentBaseDto;
  locationId?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SortedUserDto {
  items: (Omit<UserBaseDto, 'location' | 'department'> & {
    location: LocationBaseDto;
    department: DepartmentBaseDto;
  })[];
  total: number;
}
