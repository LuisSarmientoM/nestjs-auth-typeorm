import { loggerOptions } from '@config/logger.config'
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { LoggerModule as PinoModule } from 'nestjs-pino'

import { CorrelationIdMiddleware } from '../../common/middleware/correlation-id/correlation-id.middleware'

@Global()
@Module({
    imports: [PinoModule.forRoot(loggerOptions)],
})
export class LoggerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorrelationIdMiddleware).forRoutes('*')
    }
}
