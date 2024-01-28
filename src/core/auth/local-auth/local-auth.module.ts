import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersModule } from '@core/users/users.module'

import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'
import { LocalAuthController } from './local-auth.controller'
import { LocalAuthService } from './local-auth.service'
import { LocalAuthStrategy } from './local-auth.strategy'
import { RecoveryPassword } from './user-recovery.entity'

@Module({
    controllers: [LocalAuthController],
    imports: [
        UsersModule,
        PassportModule,
        JwtAuthModule,
        TypeOrmModule.forFeature([RecoveryPassword]),
    ],
    providers: [LocalAuthService, LocalAuthStrategy],
})
export class LocalAuthModule {}
