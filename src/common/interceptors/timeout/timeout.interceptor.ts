import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    RequestTimeoutException,
} from '@nestjs/common'
import { Observable, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    /**
     * Intercepts all incoming requests.
     * It sets a timeout for each request and throws a RequestTimeoutException if the request takes longer than the timeout.
     * @param {ExecutionContext} context - The execution context.
     * @param {CallHandler} next - The CallHandler that will be executed.
     * @returns {Observable<any>} An Observable that will emit the response of the request.
     */
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<CallHandler> {
        return next.handle().pipe(
            timeout(5000),
            catchError((error) => {
                if (error instanceof TimeoutError) {
                    throw new RequestTimeoutException()
                }
                throw error
            }),
        )
    }
}
