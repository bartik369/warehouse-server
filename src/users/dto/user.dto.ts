export class UserDto {
    user_id: string
    work_id: string
    login: string
    email: string 
    first_name: string 
    last_name: string
    department: string
    location: string
    created_at: Date
    updated_at: Date
}

export type TUserDto = UserDto;