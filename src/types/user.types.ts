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
    token: string;
}
export type JwtPayload = {
    sub: string;
    email: string;
};
export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };