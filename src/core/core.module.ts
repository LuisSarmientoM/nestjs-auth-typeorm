import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { MailerModule } from './mailer/mailer.module'

@Module({
    imports: [AuthModule, MailerModule],
    exports: [AuthModule, MailerModule],
})
export class CoreModule {}
