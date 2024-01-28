import { handleDatabaseError } from '@filters/database-error.exception'
import { handleError } from '@filters/handle-error.exception'
import { Environments } from '@models/config'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { SwaggerModule } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout/timeout.interceptor'
import swaggerConfig from './config/swagger.config'

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    )

    const configService = app.get(ConfigService)
    const logger = app.get(Logger)

    // Enable CORS
    app.enableCors({
        credentials: true,
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })

    app.useGlobalFilters(new handleError(), new handleDatabaseError())
    app.useLogger(app.get(Logger))
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new TimeoutInterceptor(),
    )

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (errors) => {
                throw new BadRequestException(
                    errors.map((error) => {
                        logger.error(error)
                        const { constraints, property } = error
                        const [key] = Object.keys(constraints)

                        return {
                            field: property,
                            message: constraints[key],
                        }
                    }),
                )
            },
        }),
    )

    const document = SwaggerModule.createDocument(app, swaggerConfig)

    SwaggerModule.setup('/docs', app, document, {
        customSiteTitle: 'API',
        swaggerOptions: {
            persistAuthorization: true,
        },
    })
    const HOST = configService.get<string>(Environments.HOST, 'localhost')
    const PORT = configService.get<number>(Environments.PORT, 3000)

    await app.listen(3000)
    logger.log(`🚀  Server is listening on http://${HOST}:${PORT}`)
}
bootstrap().catch(handleStartError)

function handleStartError(error: unknown) {
    // eslint-disable-next-line no-console
    console.error(error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
}

process.on('uncaughtException', handleStartError)
