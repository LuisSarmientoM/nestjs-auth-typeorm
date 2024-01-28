import { loggerOptions } from '@config/logger.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { LoggerModule } from 'nestjs-pino'

import appConfig from './config/app.config'
import databaseConnection from './config/database-connections'
import { CoreModule } from './core/core.module'
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
        UsersModule,
        CoreModule,
        LoggerModule,
    ],
    controllers: [],
    providers: [ConfigService],
})
export class AppModule {}
