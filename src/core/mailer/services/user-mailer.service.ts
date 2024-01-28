import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { User } from '@core/users/entities/user.entity'

import { MailerService } from './mailer.service'

@Injectable()
export class UserMailerService {
    constructor(private readonly mailerService: MailerService) {}
    @OnEvent('user.created')
    handleUserCreatedEvent(event: User) {
        const html = this.mailerService.templates.createUser({
            name: event.name,
        })

        this.mailerService.sendEmail({
            html,
            log: `User created: ${event.name} <${event.email}>`,
            subject: 'User created',
            to: event.email,
        })
    }
}
