import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { EmailConfig, Environments } from '@models/config'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Handlebars from 'handlebars'
import { createTransport, Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { SendEmail } from '../interfaces/send.dto'
import { TemplateData, Templates } from '../interfaces/templates.dto'

@Injectable()
export class MailerService {
    private readonly transport!: Transporter<SMTPTransport.SentMessageInfo>
    private readonly email!: string
    private logger = new Logger()

    readonly templates: Templates = {
        createUser: MailerService.parseTemplate('create-user.hbs'),
    }

    constructor(private readonly configService: ConfigService) {
        const emailConfig = configService.get<EmailConfig>(Environments.EMAIL)
        if (emailConfig && emailConfig.EMAIL_ALLOW) {
            this.transport = createTransport(emailConfig.EMAIL_CONFIG)
            this.email = `"API" <${emailConfig.EMAIL_CONFIG.auth.user}>`
        }
    }

    private static parseTemplate(
        name: string,
    ): Handlebars.TemplateDelegate<TemplateData> {
        const templateText = readFileSync(
            join(__dirname, '../../../../assets/templates', name),
            'utf8',
        )
        return Handlebars.compile<TemplateData>(templateText, {
            strict: true,
        })
    }

    sendEmail(dto: SendEmail) {
        if (!this.transport) {
            this.logger.log(dto.log)
            return
        }
        dto.from = this.email
        this.transport
            .sendMail(dto)
            .then(() => {
                this.logger.log('Email sent: %s', dto.log)
            })
            .catch((error) => {
                this.logger.error(error)
            })
    }
}
