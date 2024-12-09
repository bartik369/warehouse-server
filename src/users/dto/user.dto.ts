import { IsEmail} from 'class-validator';
export class UserDto {
    id: string
    workId: string
    login: string
    @IsEmail()
    email: string 
    firstName: string 
    lastName: string
    department: string
    locationId: string
    createdAt: Date
    updatedAt: Date
}

export type User = UserDto;