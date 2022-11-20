import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError, EntityPropertyNotFoundError } from 'typeorm';
import { GlobalResponseError } from './global-response-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = (exception as any).message.message;
        let code = 'HttpException';

        Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        switch (exception.constructor) {
            case HttpException:
                status = (exception as HttpException).getStatus();
                message = (exception as HttpException).message;
                break;
            case QueryFailedError:  // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message;
                code = (exception as any).code;
                break;
            case EntityNotFoundError:  // this is another TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityNotFoundError).message;
                code = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as CannotCreateEntityIdMapError).message;
                code = (exception as any).code;
                break;
            case EntityPropertyNotFoundError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityPropertyNotFoundError).message;
                code = (exception as any).code;
                break;
            case BadRequestException: // and another
                status = HttpStatus.BAD_REQUEST
                message = (exception as BadRequestException).message;
                code = (exception as any).code;
                break;
            case UnauthorizedException: // and another
                status = HttpStatus.UNAUTHORIZED
                message = (exception as UnauthorizedException).message;
                code = (exception as any).code;
                break;
            case ForbiddenException: // and another
                status = HttpStatus.FORBIDDEN
                message = (exception as ForbiddenException).message;
                code = (exception as any).code;
                break;
            case NotFoundException: // and another
                status = HttpStatus.NOT_FOUND
                message = (exception as NotFoundException).message;
                code = (exception as any).code;
                break;
            case UnprocessableEntityException: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = ((exception as UnprocessableEntityException).getResponse() as any).message || (exception as UnprocessableEntityException).message;
                code = (exception as any).code;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR
        }

        response.status(status).json(GlobalResponseError(status, message, code, request));
    }
}