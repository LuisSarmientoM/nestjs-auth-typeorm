import { Environments } from '@models/config'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'

import { JwtAuthGuard } from './jwt.guard'
import { JwtAuthService } from './jwt-auth.service'

/**
 * The JwtAuthModule is responsible for providing and configuring the JwtAuthService.
 * It imports the JwtModule and configures it with the application's JWT secret and sign options.
 * It also provides the JwtAuthGuard, which can be used to protect routes that require authentication.
 */
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>(Environments.APP_JWT_SECRET),
                signOptions: {
                    expiresIn: configService.get<string>(
                        Environments.APP_JWT_EXPIRES_IN,
                    ),
                    algorithm: 'HS256',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        JwtAuthService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
    exports: [JwtAuthService, JwtModule],
})
export class JwtAuthModule {}
