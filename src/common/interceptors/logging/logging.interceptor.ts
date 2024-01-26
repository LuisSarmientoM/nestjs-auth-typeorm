import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger()
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<CallHandler> {
        const { body, url } = context
            .switchToHttp()
            .getRequest<FastifyRequest>()

        if (url.includes('auth')) {
            this.logger.log({
                message: 'Starting',
                context: context.getClass().name,
                method: context.getHandler().name,
            })
            return next.handle().pipe(
                tap(() =>
                    this.logger.log({
                        message: 'Eneded',
                        context: context.getClass().name,
                        method: context.getHandler().name,
                    }),
                ),
            )
        }
        this.logger.log({
            message: 'Starting',
            context: context.getClass().name,
            method: context.getHandler().name,
            args: body,
        })

        return next.handle().pipe(
            tap(() =>
                this.logger.log({
                    message: 'Eneded',
                    context: context.getClass().name,
                    method: context.getHandler().name,
                }),
            ),
        )
    }
}
