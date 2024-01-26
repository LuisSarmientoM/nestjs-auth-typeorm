import { Current } from '@inpower/models/auth/auth-payload'
import { FastifyRequest as Request } from 'fastify'

declare module 'fastify' {
    interface FastifyRequest extends Request {
        user: Current
    }
}
