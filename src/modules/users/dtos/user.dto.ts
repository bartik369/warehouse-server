import { IsEmail} from 'class-validator';
export class UserDto {
    id: string
    userName: string
    email: string 
    workId: string
    firstName: string 
    lastName: string
    isActive: boolean
    department: string
    locationId: string
    createdAt: Date
    updatedAt: Date
}

export type User = UserDto;