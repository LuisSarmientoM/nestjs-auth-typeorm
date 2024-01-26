import { Current } from '@models/jwt-payload'
import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common'
import { isFalsy } from '@utils/validation.util'
import { FastifyRequest } from 'fastify'

export const CurrentUser = createParamDecorator<Current>(
    (_, ctx: ExecutionContext): Current => {
        const req = ctx.switchToHttp().getRequest<FastifyRequest>()
        if (!req.user) throw new UnauthorizedException('User not found')
        const user: Current = req.user as Current

        if (isFalsy(user)) throw new UnauthorizedException('User not found')

        return user
    },
)
