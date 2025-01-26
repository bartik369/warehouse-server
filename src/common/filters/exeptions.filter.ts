import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from "@nestjs/common";
import { Response } from 'express';

@Catch()
 export class ExeptionsFilter implements ExceptionFilter {
    catch(exeption: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exeption instanceof HttpException) {
            status = exeption.getStatus();
            const responseMessage = exeption.getResponse();

            if (typeof responseMessage === 'object' && responseMessage !== null) {
                message = responseMessage['message'] || message;
            } else {
                message = responseMessage as string;
            }
        }
        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        });
    }
 }