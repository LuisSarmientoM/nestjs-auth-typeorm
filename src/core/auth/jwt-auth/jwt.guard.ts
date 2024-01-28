import { IS_PUBLIC_KEY } from '@decorators/public.decorator'
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UsersService } from '@server/users/users.service'
import { isFalsy } from '@utils/validation.util'
import { FastifyRequest } from 'fastify'
import { UserRoles } from 'src/models/user-roles.enum'

import { JwtAuthService } from './jwt-auth.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtAuthService,
        private readonly userService: UsersService,
    ) {}

    /**
     * Determines whether a request can proceed.
     * - If the route is public, it returns true.
     * - If the route is not public, it checks if the JWT token in the request is valid.
     * @param {ExecutionContext} context - The execution context.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the request can proceed.
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        )

        if (isPublic) {
            return true
        }
        const activate = await this.setHttpHeader(
            context.switchToHttp().getRequest<FastifyRequest>(),
        )

        if (!activate) {
            throw new UnauthorizedException('No autorizado')
        }

        return activate
    }

    /**
     * Validate if the token is valid and active
     * Set the user in the request
     * @param req
     * @returns boolean
     */
    private async setHttpHeader(req: FastifyRequest) {
        let auth: string | undefined

        // Validate if headers have a  valid Bearer token
        if (req && req.headers) {
            auth = req.headers.authorization
        }
        if (isFalsy(auth)) {
            return false
        }

        if (typeof auth !== 'string') {
            return false
        }

        const regex = /(\S+)\s+(\S+)/
        const match = auth.match(regex)
        if (!match || match.length < 3) {
            return false
        }

        const token = match[2]

        try {
            const payload = await this.jwtService.verifyToken(token)
            const user = await this.userService.findOneComplete(payload.email)
            if (!user.isActive) return false
            req.user = {
                id: user.id,
                email: user.email,
                roleCode: user.role.code as UserRoles,
            }

            return true
        } catch {
            return false
        }
    }
}
