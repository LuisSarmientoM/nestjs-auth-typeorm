import { AppConfig, Environment } from '@models/config'
import { Logger } from '@nestjs/common'
import * as Joi from 'joi'

// class appConfig {
//     NODE_ENV: Environment
//     HOST: string
//     PORT: number
//     CLIENT: string
//     DB_HOST: string
//     DB_PORT: number
//     DB_NAME: string
//     DB_USERNAME: string
//     DB_PASSWORD: string
//     EMAIL: EmailConfig
//     APP_JWT_SECRET: string
//     APP_JWT_EXPIRES_IN: string
// }

export default (): AppConfig => {
    const logger = new Logger()

    const values: AppConfig = {
        NODE_ENV: process.env.NODE_ENV as Environment,
        HOST: process.env.HOST,
        PORT: Number.parseInt(process.env.PORT),
        CLIENT: process.env.CLIENT_URL,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: Number.parseInt(process.env.DB_PORT),
        DB_NAME: process.env.DB_NAME,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        APP_JWT_SECRET: process.env.APP_JWT_SECRET,
        APP_JWT_EXPIRES_IN: process.env.APP_JWT_EXPIRES_IN,
        EMAIL: {
            EMAIL_ALLOW: process.env.EMAIL_ALLOW === 'true',
            EMAIL_CONFIG: {
                host: process.env.EMAIL_HOST,
                port: Number.parseInt(process.env.EMAIL_PORT, 10),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
        },
    }
    const schema = Joi.object({
        NODE_ENV: Joi.string().valid('production', 'development').required(),
        HOST: Joi.string().required(),
        PORT: Joi.number().required(),
        CLIENT: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        APP_JWT_SECRET: Joi.string().required(),
        APP_JWT_EXPIRES_IN: Joi.string().required(),
        EMAIL: Joi.object({
            EMAIL_ALLOW: Joi.boolean().default(false),
            EMAIL_CONFIG: Joi.object({
                host: Joi.string(),
                port: Joi.number(),
                secure: Joi.boolean(),
                auth: {
                    user: Joi.string(),
                    pass: Joi.string(),
                },
                tls: {
                    rejectUnauthorized: false,
                },
            }),
        }),
    })
    const { error } = schema.validate(values, { abortEarly: false })

    if (error) {
        logger.log('error', error)
        throw new Error(
            `Validation failed - Is there an environment variable missing?
          ${error.message}`,
        )
    }
    return values
}
