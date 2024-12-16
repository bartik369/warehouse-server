import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
    (_: unknown, ctx:ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const userId = request.body.sub as string
        return userId
    }
)