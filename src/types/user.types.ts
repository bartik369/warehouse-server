import { User } from "src/users/dto/user.dto";
export type Tokens = {
    accessToken: string;
    refreshToken: string;
}
export type GroupAuthData = {
    user: User;
    tokens: Tokens;
}

export type AuthData = {
    user: User;
    accessToken: string;
}