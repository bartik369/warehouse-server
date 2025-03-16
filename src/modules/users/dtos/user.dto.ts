
export class UserDto {
  id: string;
  userName: string;
  email: string;
  workId: string;
  firstNameRu: string;
  lastNameRu: string;
  firstNameEn: string;
  lastNameEn: string;
  isActive: boolean;
  department: string;
  locationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type User = UserDto;
