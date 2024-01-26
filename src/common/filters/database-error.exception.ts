import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ErrorResponse } from 'src/models/error-response'
import { ErrorDescription, QueryFailedError } from 'typeorm'

interface ErrorCodes {
    [key: string]: {
        statusCode: number
        message: (error: ErrorDescription) => string
    }
}

const errorCodes: ErrorCodes = {
    '23502': {
        statusCode: HttpStatus.BAD_REQUEST,
        message: (error) => `'${error.column}' no puede ser vacía`,
    },
    '23505': {
        statusCode: HttpStatus.CONFLICT,
        message: (error) => {
            const key: string = error.detail as string
            const regex = /\((.*?)\)/g
            const keyMatches = key.match(regex)
            if (!keyMatches) {
                return 'Error interno del servidor, contacte al administrador'
            }
            const matches = keyMatches.map((match) => match.slice(1, -1))

            return `El valor de '${matches[0]}' ya existe`
        },
    },
    '42703': {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: (error) => {
            const logger = new Logger()
            logger.error(error)
            return 'Error interno del servidor, contacte al administrador'
        },
    },
}
@Catch(QueryFailedError)
export class handleDatabaseError implements ExceptionFilter {
    logger = new Logger()
    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<FastifyReply>()
        const request = ctx.getRequest<FastifyRequest>()

        this.logger.log(exception.getStatus())
        const { statusCode, message } = errorCodes[exception.getStatus()]
        const errorResponse: ErrorResponse = {
            statusCode: statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message(exception),
        }

        await response.status(statusCode).send(errorResponse)
    }
}
