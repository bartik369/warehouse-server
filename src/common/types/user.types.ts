import { IUser } from 'src/modules/users/dtos/user.dto';
export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
export type GroupAuthData = {
  user: IUser;
  tokens: Tokens;
};

export type AuthData = {
  user: IUser;
  accessToken: string;
  refreshToken: string;
};
export type JwtPayload = {
  sub: string;
  email: string;
};
export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };
