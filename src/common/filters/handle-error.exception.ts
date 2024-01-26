import { ErrorResponse } from '@models/error-response'
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Catch(HttpException)
export class handleError implements ExceptionFilter {
    logger = new Logger()
    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<FastifyReply>()
        const request = ctx.getRequest<FastifyRequest>()
        const status: HttpStatus = exception.getStatus()

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(exception)
            exception.message =
                'Internal Server Error, contact the administrator'
        }
        const errorResponse: ErrorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
        }
        await response.status(status).send(errorResponse)
    }
}
