import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { LocalAuthService } from './local-auth.service'

/**
 * It extends the PassportStrategy from NestJS Passport and uses the 'local' strategy from Passport.js.
 * It validates the user's email and password, and throws an UnauthorizedException if the validation fails.
 */
@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly localAuthService: LocalAuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        })
    }

    /**
     * Validates the user's email and password.
     * If the user's credentials are valid and the user is active, it returns the user's data.
     * If the user's credentials are invalid or the user is not active, it throws an UnauthorizedException.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Object} An object containing the user's data.
     * @throws {UnauthorizedException} If the user's credentials are invalid or the user is not active.
     */
    async validate(email: string, password: string) {
        const emailLower = email.toLowerCase()
        const user = await this.localAuthService.validateUser(
            emailLower,
            password,
        )
        if (!user || !user.isActive) {
            throw new UnauthorizedException(
                'Usuario no existe o credenciales incorrectas',
            )
        }

        return user
    }
}
