import { loggerOptions } from '@config/logger.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { LoggerModule } from 'nestjs-pino'

import { CoreModule } from '@core/core.module'

import appConfig from './config/app.config'
import databaseConnection from './config/database-connections'
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
        LoggerModule.forRoot(loggerOptions),
        EventEmitterModule.forRoot(),
        databaseConnection(),
        CoreModule,
        LoggerModule,
    ],
    controllers: [],
    providers: [ConfigService],
})
export class AppModule {}
