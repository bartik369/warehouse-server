import { DepartmentBaseDto } from 'src/modules/departments/dtos/department-base.dto';

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
