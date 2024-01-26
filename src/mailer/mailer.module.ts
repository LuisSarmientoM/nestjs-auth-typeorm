import { Module } from '@nestjs/common'

import { MailerService } from './services/mailer.service'
import { UserMailerService } from './services/user-mailer.service'

@Module({
    providers: [MailerService, UserMailerService],
})
export class MailerModule {}
