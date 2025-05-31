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
  locationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
