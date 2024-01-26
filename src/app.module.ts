import { loggerOptions } from '@config/logger.config'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { LoggerModule } from 'nestjs-pino'

import { AuthModule } from './auth/auth.module'
import { CorrelationIdMiddleware } from './common/middleware/correlation-id/correlation-id.middleware'
import appConfig from './config/app.config'
import databaseConnection from './config/database-connections'
import { MailerModule } from './mailer/mailer.module'
import { UsersModule } from './server/users/users.module'
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
        LoggerModule.forRoot(loggerOptions),
        EventEmitterModule.forRoot(),
        databaseConnection(),
        MailerModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [],
    providers: [ConfigService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorrelationIdMiddleware).forRoutes('*')
    }
}
