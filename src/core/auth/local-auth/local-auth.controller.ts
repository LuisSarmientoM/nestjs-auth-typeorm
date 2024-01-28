import { Public } from '@decorators/public.decorator'
import { Email } from '@models/email.dto'
import { Current } from '@models/jwt-payload'
import { MessageDto } from '@models/message.dto'
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'

import { JwtAuthService } from '../jwt-auth/jwt-auth.service'
import { LocalLoginDto } from './dto/local-login'
import { RecoveryPasswordDto } from './dto/recover-password'
import { LocalAuthService } from './local-auth.service'

/**
 * LocalAuthController is a controller that handles local authentication.
 * It provides endpoints for signing in and initiating the password recovery process.
 */
@Controller('auth')
@ApiTags('auth')
export class LocalAuthController {
    constructor(
        private readonly jwtAuthService: JwtAuthService,
        private localAuthService: LocalAuthService,
    ) {}

    /**
     * Handles user sign-in.
     * Validates if the user exists, if the credentials are valid, and returns a token.
     * @param {LocalLoginDto} body - The login credentials of the user.
     * @returns {Object} An object containing the JWT token.
     */
    @Post('sign-in')
    @Public()
    @UseGuards(AuthGuard('local'))
    login(@Body() body: LocalLoginDto, @Req() req: FastifyRequest) {
        const { email, id } = req.user as Current
        const token = this.jwtAuthService.generateToken({ email, id })
        return { token }
    }

    /**
     * Handles the password recovery process.
     * @param {Email} body - The email of the user who wants to recover their password.
     * @returns {Promise<MessageDto>} A promise that resolves when the password recovery process has been initiated.
     */
    @Post('recovery-password')
    @Public()
    recoveryPassword(@Body() { email }: Email): Promise<MessageDto> {
        return this.localAuthService.recoveryPassword(email)
    }

    /**
     * Handles the password change process.
     * It takes a RecoveryPasswordDto object as input which includes the new password, repeated password, and a token.
     * The token is used to verify the user's identity and the new password is set for the user.
     * @param {RecoveryPasswordDto} dto - The request body containing the new password, repeated password, and a token.
     * @returns {Promise<MessageDto>} A promise that resolves to a MessageDto object when the password has been successfully changed.
     */
    @Post('change-password')
    @Public()
    changePassword(
        @Body()
        dto: RecoveryPasswordDto,
    ): Promise<MessageDto> {
        return this.localAuthService.changePassword(dto)
    }
}
