import { join } from 'node:path'

import { Environments } from '@models/config'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const databaseConnection = () =>
    TypeOrmModule.forRootAsync({
        useFactory(configService: ConfigService) {
            const isProduction =
                configService.get(Environments.NODE_ENV) === 'production'
            return {
                type: 'postgres',
                host: configService.get(Environments.DB_HOST),
                port: configService.get(Environments.DB_PORT),
                username: configService.get(Environments.DB_USERNAME),
                password: configService.get(Environments.DB_PASSWORD),
                database: configService.get(Environments.DB_NAME),
                entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
                retryAttempts: 3,
                synchronize: !isProduction,
                autoLoadEntities: !isProduction,
                namingStrategy: new SnakeNamingStrategy(),
                // logging: !isProduction,
            }
        },
        inject: [ConfigService],
    })

export default databaseConnection
