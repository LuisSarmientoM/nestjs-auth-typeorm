import { MessageDto } from '@models/message.dto'
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersService } from '@server/users/users.service'
import { isFalsy } from '@utils/validation.util'
import { compareSync } from 'bcrypt'
import { Repository } from 'typeorm'

import { JwtAuthService } from '../jwt-auth/jwt-auth.service'
import { RecoveryPasswordDto } from './dto/recover-password'
import { RecoveryPassword } from './user-recovery.entity'

/**
 * LocalAuthService is a service that handles local authentication.
 * It provides methods for validating users and initiating the password recovery process.
 */
@Injectable()
export class LocalAuthService {
    constructor(
        @InjectRepository(RecoveryPassword)
        private readonly recoveryPasswordRepository: Repository<RecoveryPassword>,
        private readonly userService: UsersService,
        private readonly jwtService: JwtAuthService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * Validates a user's credentials.
     * If the user's credentials are valid, it returns the user's id, email, and isActive status.
     * @param {string} email - The email of the user.
     * @param {string} password - The password of the user.
     * @returns {Object} An object containing the user's id, email, and isActive status.
     */
    async validateUser(email: string, password: string) {
        const user = await this.userService.findOneComplete(email)

        if (isFalsy(user) || isFalsy(user.password)) {
            throw new UnauthorizedException('Usuario no identificado')
        }

        const comparePasswords = compareSync(password, user.password)

        if (user && comparePasswords) {
            return {
                id: user.id,
                email: user.email,
                isActive: user.isActive,
            }
        }
    }

    /**
     * Initiates the password recovery process for a user.
     * Emit an event to send an email with the recovery link
     * @param {string} email - The email of the user who wants to recover their password.
     * @returns {Promise<MessageDto>} A promise that resolves when the password recovery process has been initiated.
     */
    async recoveryPassword(email: string): Promise<MessageDto> {
        const user = await this.userService.findOneComplete(email)

        if (isFalsy(user)) {
            return {
                message:
                    'Si el correo es correcto, se enviará un correo con las instrucciones para recuperar la contraseña',
            }
        }

        const token = this.jwtService.generateToken({
            email: user.email,
            id: user.id,
            hash: Math.random().toString(36).slice(2, 15),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            iat: Math.floor(Date.now() / 1000),
        })
        await this.recoveryPasswordRepository.save({
            userId: user.id,
            token,
        })

        this.eventEmitter.emit(
            'user.recovery-password',
            {
                email: user.email,
                name: user.name,
                id: user.id,
            },
            token,
        )

        return {
            message:
                'Si el correo es correcto, se enviará un correo con las instrucciones para recuperar la contraseña',
        }
    }

    /**
     * Changes the password of a user.
     * It takes a RecoveryPasswordDto object as input which includes the new password, repeated password, and a token.
     * The token is used to verify the user's identity and the new password is set for the user.
     * @param {RecoveryPasswordDto} dto - The request body containing the new password, repeated password, and a token.
     * @returns {Promise<MessageDto>} A promise that resolves to a MessageDto object when the password has been successfully changed.
     */
    async changePassword(dto: RecoveryPasswordDto): Promise<MessageDto> {
        const { password, repeatPassword, token } = dto
        const { id, email } = await this.jwtService.verifyToken(token)

        const recoveryPassword =
            await this.recoveryPasswordRepository.findOneBy({
                userId: id,
            })

        if (!recoveryPassword) {
            throw new BadRequestException('Token inválido')
        }

        const passwordChanged = await this.userService.changePassword(email, {
            password,
            repeatPassword,
        })
        await this.recoveryPasswordRepository.delete(recoveryPassword.id)

        return passwordChanged
    }
}
