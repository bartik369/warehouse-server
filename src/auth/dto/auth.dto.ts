import {} from 'class-validator';
export class AuthDto {
    login: string
    password: string
}

export type TAuthDto = AuthDto;