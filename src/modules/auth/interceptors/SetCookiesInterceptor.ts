import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        if (data?.refreshToken) {
          response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
        }
        if (data?.accessToken) {
          response.cookie('accessToken', data.accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            maxAge: 1 * 60 * 1000,
          });
        }
        if (data?.csrfToken) {
          response.cookie('csrfToken', data.csrfToken, {
            httpOnly: false,
            sameSite: 'strict',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
        }
      }),
    );
  }
}
