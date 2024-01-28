import { JwtPayload } from '@models/jwt-payload'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

/**
 * @description JwtAuthService is a service responsible for handling JWT-based authentication.
 * @description It provides methods to verify, generate, and recover JWT tokens.
 * @class JwtAuthService
 * @method verifyToken - Verifies the provided JWT token.
 * @method generateToken - Generates a JWT token for the user with the given payload.
 * @method generateRecoveryToken - Generates a JWT token for the user with the given payload.
 */
@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * @description Verifies the provided JWT token.
     * @param {string} token - The JWT token to verify.
     * @returns {Promise<JwtPayload>} A promise that resolves to the payload of the verified JWT token.
     */
    public async verifyToken(token: string): Promise<JwtPayload> {
        return this.jwtService.verifyAsync(token)
    }

    /**
     * @description Generate a Auth JWT token for the user with the given payload using default expiration time and algorithm
     * @param {Partial<JwtPayload>} user - The user for whom to generate the token. Only the 'email' and 'id' properties are used.
     * @returns {string} JWT token string
     */
    public generateToken(user: Partial<JwtPayload>): string {
        const token = this.jwtService.sign({
            email: user.email,
            id: user.id,
        })
        return token
    }

    /**
     * @description Generate a JWT token for the user with the given payload using default expiration time and algorithm
     * @param {JwtPayload} user - The user for whom to generate the recovery token.
     * @returns {string} JWT token string
     */
    public generateRecoveryToken(user: JwtPayload): string {
        const token = this.jwtService.sign({
            email: user.email,
            type: 'recovery',
            id: user.id,
        })
        return token
    }
}
