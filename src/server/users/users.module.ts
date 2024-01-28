import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CorrelationIdMiddleware } from '../../common/middleware/correlation-id/correlation-id.middleware'
import { JwtAuthModule } from '../../core/auth/jwt-auth/jwt-auth.module'
import { RecoveryPassword } from '../../core/auth/local-auth/user-recovery.entity'
import { User } from './entities/user.entity'
import { UserRoles } from './entities/user-role.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

/**
 * The UsersModule is responsible for providing and configuring the UsersController and UsersService.
 * It imports the TypeOrmModule for the User, UserRoles, and RecoveryPassword entities, and the JwtAuthModule.
 * It exports the UsersService, which can be used by other modules.
 * It is decorated with the @Global() decorator, which makes it a global module in NestJS.
 * A global module's providers (and exports if they are exported) are available even in modules that do not import them.
 */
@Global()
@Module({
    controllers: [UsersController],
    imports: [
        TypeOrmModule.forFeature([User, UserRoles, RecoveryPassword]),
        JwtAuthModule,
    ],
    exports: [UsersService],
    providers: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorrelationIdMiddleware).forRoutes('*')
    }
}
