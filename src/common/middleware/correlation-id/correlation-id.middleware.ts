import { randomUUID } from 'node:crypto'

import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

export const CORRELATION_ID_HEADER = 'x-correlation-id'
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(req: FastifyRequest, res: FastifyReply, next: () => void) {
        const id = randomUUID()
        req.headers[CORRELATION_ID_HEADER] = id
        req.headers[CORRELATION_ID_HEADER] = id
        next()
    }
}
