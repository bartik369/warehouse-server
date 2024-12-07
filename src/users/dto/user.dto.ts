export class UserDto {
    id: string
    workId: string
    login: string
    email: string 
    firstName: string 
    lastName: string
    department: string
    locationId: string
    createdAt: Date
    updatedAt: Date
}

export type TUserDto = UserDto;