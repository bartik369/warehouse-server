import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccessToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.cookies?.accessToken;
  },
);
