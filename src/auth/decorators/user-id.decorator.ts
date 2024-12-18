import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
    (_: unknown, ctx:ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const userId = request.body.id as string
        return userId
    }
)