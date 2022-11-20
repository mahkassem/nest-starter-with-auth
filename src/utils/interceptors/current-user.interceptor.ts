import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
// "implements" guide us how to put together an interceptor
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService) { }
    // handler refers to the route handler
    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { user } = request;
        // run the actual route handler
        return handler.handle();
    }
}