import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  async (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // const userId = request.body.id as string;
    const userId = request.user.sub as string;
    return userId;
  },
);
