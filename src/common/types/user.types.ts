import { UserBaseDto } from 'src/modules/users/dtos/user-base.dto';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
export type GroupAuthData = {
  user: UserBaseDto;
  tokens: Tokens;
};

export type AuthData = {
  user: UserBaseDto;
  accessToken: string;
  refreshToken: string;
};
export type JwtPayload = {
  sub: string;
  email: string;
};
export type JwtPayloadWithRt = JwtPayload & { refreshToken: string }