export enum Environment {
    Development = 'development',
    Production = 'production',
}

interface IEmailAuth {
    user: string
    pass: string
}
interface TLS {
    rejectUnauthorized: boolean
}
export interface IEmailConfig {
    host: string
    port: number
    secure: boolean
    auth: IEmailAuth
    tls: TLS
}

export interface EmailConfig {
    EMAIL_ALLOW: boolean
    EMAIL_CONFIG: IEmailConfig
}
export interface AppConfig {
    NODE_ENV: Environment
    HOST: string
    PORT: number
    CLIENT: string
    DB_HOST: string
    DB_PORT: number
    DB_NAME: string
    DB_USERNAME: string
    DB_PASSWORD: string
    EMAIL: EmailConfig
    APP_JWT_SECRET: string
    APP_JWT_EXPIRES_IN: string
}

export enum Environments {
    NODE_ENV = 'NODE_ENV',
    HOST = 'HOST',
    PORT = 'PORT',
    CLIENT = 'CLIENT',
    DB_HOST = 'DB_HOST',
    DB_PORT = 'DB_PORT',
    DB_NAME = 'DB_NAME',
    DB_USERNAME = 'DB_USERNAME',
    DB_PASSWORD = 'DB_PASSWORD',
    EMAIL = 'EMAIL',
    APP_JWT_SECRET = 'APP_JWT_SECRET',
    APP_JWT_EXPIRES_IN = 'APP_JWT_EXPIRES_IN',
}
