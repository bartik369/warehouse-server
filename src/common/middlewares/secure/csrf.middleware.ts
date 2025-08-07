import { NestMiddleware, Injectable, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method.toUpperCase();
    if (['GET', 'OPTIONS', 'HEAD'].includes(method)) {
      return next();
    }
    const csrfFromHeader = req.headers['x-csrf-token'];
    const csrfFromCookie = req.cookies['csrfToken'];

    if (!csrfFromHeader || csrfFromHeader !== csrfFromCookie) {
      throw new ForbiddenException('CSRF token mismatch');
    }
    next();
  }
}
