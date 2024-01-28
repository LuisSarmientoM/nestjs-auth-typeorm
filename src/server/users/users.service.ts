import { PaginatedResponseDto } from '@decorators/paginate-ok-response.decorator'
import { SearchPaginatedDto } from '@models/search.dto'
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectRepository } from '@nestjs/typeorm'
import { hash } from 'bcrypt'
import { plainToClass } from 'class-transformer'
import { ILike, Repository } from 'typeorm'

import { JwtAuthService } from '../../core/auth/jwt-auth/jwt-auth.service'
import { RecoveryPassword } from '../../core/auth/local-auth/user-recovery.entity'
import { changePasswordDto } from './dto/change-password.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { ReadUserDto } from './dto/read-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

/**
 * UsersService is a service that handles user-related operations.
 * It uses the UsersRepository to perform the necessary operations.
 * It also uses the EventEmitter2 to emit events.
 * It uses the JwtAuthService to generate a token for password recovery.
 * @method create - Creates a new user.
 * @method findAll - Finds all users.
 * @method findOne - Finds a user by id.
 * @method update - Updates a user.
 * @method toggleActive - Toggles the active status of a user.
 * @method changePassword - Changes the password of a user.
 * @method findOneComplete - Finds a user by email.
 * @class UsersService
 */
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(RecoveryPassword)
        private readonly recoveryPasswordRepository: Repository<RecoveryPassword>,

        private eventEmitter: EventEmitter2,

        private readonly jwtService: JwtAuthService,
    ) {}
    /**
     * Creates a new user.
     * It takes a CreateUserDto object as input which includes the user's data.
     * @param {CreateUserDto} dto - The CreateUserDto object containing the user's data.
     * @returns {Promise<ReadUserDto>} A promise that resolves to a ReadUserDto object containing the user's data.
     */
    async create(dto: CreateUserDto) {
        const newUser = this.usersRepository.create(dto)

        const user = await this.usersRepository.save(newUser)

        const token = this.jwtService.generateToken({
            email: user.email,
            id: user.id,
            hash: Math.random().toString(36).slice(2, 15),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            iat: Math.floor(Date.now() / 1000),
        })

        await this.recoveryPasswordRepository.save({
            userId: user.id,
            token,
        })

        this.eventEmitter.emit('user.created', user, token)
        return plainToClass(ReadUserDto, user)
    }

    /**
     * Find users and count.
     * It takes a SearchPaginatedDto object as input which can include filters and pagination options.
     * @param {SearchPaginatedDto} dto - The SearchPaginatedDto object containing the filters and pagination options.
     * @returns {Promise<PaginatedResponseDto<ReadUserDto>>} A promise that resolves to a PaginatedResponseDto object containing the users' data.
     */
    async findAll(
        filter: SearchPaginatedDto,
    ): Promise<PaginatedResponseDto<ReadUserDto>> {
        const [data, count] = await this.usersRepository.findAndCount({
            where: {
                email: ILike(`%${filter.term}%`),
            },
            order: {
                name: 'ASC',
            },
            skip: filter.offset * filter.limit,
            take: filter.limit,
        })

        return {
            data: data.map((user) => plainToClass(ReadUserDto, user)),
            count,
        }
    }

    /**
     * Find user by id.
     * It takes a string as input which is the id of the user to be found.
     * @param {string} id - The id of the user to be found.
     * @returns {Promise<ReadUserDto>} A promise that resolves to a ReadUserDto object containing the user's data.
     */
    async findOne(id: string): Promise<ReadUserDto> {
        const user = await this.usersRepository.findOneBy({ id })
        if (!user) throw new NotFoundException('El usuario no existe')
        return plainToClass(ReadUserDto, user)
    }

    // todo prevent update email
    /**
     * Updates a user.
     * It takes a string as input which is the id of the user to be updated and a UpdateUserDto object which includes the user's data.
     * @param {string} id - The id of the user to be updated.
     * @param {UpdateUserDto} dto - The UpdateUserDto object containing the user's data.
     * @returns {Promise<ReadUserDto>} A promise that resolves to a ReadUserDto object containing the updated user's data.
     */
    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<ReadUserDto> {
        const findUser = await this.usersRepository.preload({
            id,
            ...updateUserDto,
        })

        if (!findUser) throw new NotFoundException('El usuario no existe')

        const user = await this.usersRepository.save(findUser)

        return plainToClass(ReadUserDto, user)
    }

    /**
     * Find one user by email.
     * It takes a string as input which is the email of the user to be found.
     * It returns the user's data including the password use only for internal use.
     * @param {string} email - The email of the user to be found.
     * @returns {Promise<User>} A promise that resolves to a User object containing the user's data.
     */
    async findOneComplete(email: string) {
        const user = await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'isActive', 'password'],
        })
        if (!user) throw new NotFoundException('El usuario no existe')
        return user
    }

    /**
     * Toggles the active status of a user.
     * @param {string} dto - The id of the user to be updated.
     * @returns {Promise<ReadUserDto>} A promise that resolves to a ReadUserDto object containing the updated user's data.
     */
    async toggleActive(id: string) {
        const findUser = await this.usersRepository.findOneBy({
            id,
        })
        if (!findUser) throw new NotFoundException('El usuario no existe')

        findUser.isActive = !findUser.isActive

        const user = await this.usersRepository.save(findUser)

        return plainToClass(ReadUserDto, user)
    }

    /**
     * Changes the password of a user.
     * @param {string} email - The email of the user.
     * @param {changePasswordDto} dto - The request body containing the new password and repeated password.
     * @returns {Promise<MessageDto>} A promise that resolves to a MessageDto object containing the updated user's data.
     */
    async changePassword(
        email: string,
        { password, repeatPassword }: changePasswordDto,
    ) {
        if (password !== repeatPassword) {
            throw new BadRequestException('Las contraseñas no coinciden')
        }

        const findUser = await this.usersRepository.findOneBy({
            email,
        })
        if (!findUser) throw new NotFoundException('Usuario no encontrado')

        findUser.password = await hash(password, 8)

        await this.usersRepository.save(findUser)

        return {
            message: 'Contraseña actualizada',
        }
    }
}
