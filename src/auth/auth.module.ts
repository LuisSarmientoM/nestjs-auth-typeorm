import { Module } from '@nestjs/common'

import { JwtAuthModule } from './jwt-auth/jwt-auth.module'
import { LocalAuthModule } from './local-auth/local-auth.module'

@Module({
    imports: [JwtAuthModule, LocalAuthModule],
})
export class AuthModule {}
