import { CurrentUser } from '@decorators/get-user.decorator'
import {
    ApiOkResponsePaginated,
    PaginatedResponseDto,
} from '@decorators/paginate-ok-response.decorator'
import { ErrorResponse } from '@models/error-response'
import { Uuid } from '@models/id.dto'
import { Current } from '@models/jwt-payload'
import { MessageDto } from '@models/message.dto'
import { SearchPaginatedDto } from '@models/search.dto'
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Query,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { changePasswordDto } from './dto/change-password.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { ReadUserDto, ReadUserWithRoleDto } from './dto/read-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

/**
 * UsersController is a controller that handles user-related requests.
 * It provides endpoints for getting the current user and creating a new user.
 * It uses the UsersService to perform the necessary operations.
 */
@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Gets the current user.
     * It uses the CurrentUser decorator to get the id of the current user from the JWT token.
     * @param {Current} id - The id of the current user.
     * @returns {Promise<ReadUserDto>} A promise that resolves to a ReadUserDto object containing the user's data.
     */
    @Get('current')
    @ApiOperation({
        summary: 'Get current user',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully found.',
        type: ReadUserDto,
    })
    currentUSer(@CurrentUser() { id }: Current): Promise<ReadUserWithRoleDto> {
        return this.usersService.findOne(id)
    }

    /**
     * Creates a new user.
     * It takes a CreateUserDto object as input which includes the user's data.
     * @param {CreateUserDto} createUserDto - The request body containing the user's data.
     * @returns {Promise<ReadUserDto>} A promise that resolves to a ReadUserDto object containing the created user's data.
     */
    @Post()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The user has been successfully created.',
        type: ReadUserDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'A parameter is missing or invalid',
        type: ErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User email already exists',
        type: ErrorResponse,
    })
    @ApiOperation({
        summary: 'Create a new user',
    })
    create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
        return this.usersService.create(createUserDto)
    }

    /**
     * Gets all users.
     * It takes a SearchPaginatedDto object as input which can include filters and pagination options.
     * @param {SearchPaginatedDto} dto - The filters and pagination options.
     * @returns {Promise<PaginatedResponseDto<ReadUserDto>>} A promise that resolves to a PaginatedResponseDto object containing the users' data.
     */
    @Get()
    @ApiOperation({
        summary: 'Get all users paginated and can filter by email',
    })
    @ApiOkResponsePaginated(ReadUserWithRoleDto)
    findAll(
        @Query() dto: SearchPaginatedDto,
    ): Promise<PaginatedResponseDto<ReadUserWithRoleDto>> {
        return this.usersService.findAll(dto)
    }

    /**
     * Toggles the active status of a user.
     * It takes the id of the user as input.
     * @param {Uuid} id - The id of the user.
     * @returns {Promise<ReadUserWithRoleDto>} A promise that resolves to a ReadUserDto object containing the updated user's data.
     */
    @Get(':id/toggle-active')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully disable or enable.',
        type: ReadUserWithRoleDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'The user does not exist.',
        type: ErrorResponse,
    })
    toggleActive(@Param() { id }: Uuid): Promise<ReadUserWithRoleDto> {
        return this.usersService.toggleActive(id)
    }

    /**
     * Gets a user by id.
     * It takes the id of the user as input.
     * @param {Uuid} id - The id of the user.
     * @returns {Promise<ReadUserWithRoleDto>} A promise that resolves to a ReadUserWithRoleDto object containing the user's data.
     */
    @Get(':id')
    @ApiOperation({
        summary: 'Get a user by id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully found.',
        type: ReadUserWithRoleDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'The user does not exist.',
        type: ErrorResponse,
    })
    findOne(@Param() { id }: Uuid) {
        return this.usersService.findOne(id)
    }

    /**
     * Changes a user's password as an admin.
     * It takes the email of the user and a ChangePasswordDto object as input.
     * Only admin users can change other users' passwords.
     * @param {string} email - The email of the user.
     * @param {ChangePasswordDto} dto - The request body containing the new password and repeated password.
     * @returns {Promise<MessageDto>} A promise that resolves to a MessageDto object containing the updated user's data.
     */
    @Put(':email')
    @ApiOperation({
        summary: 'Change user password as admin',
        description: 'Only admin users can change other users password',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The password has been successfully changed.',
        type: MessageDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: `- The user does not exist.
- The password and repeat password aren't the same.
        `,
        type: ErrorResponse,
    })
    changePassword(
        @Param('email') email: string,
        @Body() dto: changePasswordDto,
    ): Promise<MessageDto> {
        return this.usersService.changePassword(email, dto)
    }

    /**
     * Updates a user's name and status.
     * It takes the id of the user and an UpdateUserDto object as input.
     * The UpdateUserDto object includes the new name and status of the user.
     * @param {Uuid} id - The id of the user.
     * @param {UpdateUserDto} updateUserDto - The request body containing the new name and status of the user.
     * @returns {Promise<ReadUserDto>} A promise that resolves to a ReadUserDto object containing the updated user's data.
     */
    @Patch(':id')
    @ApiOperation({
        summary: 'Update a user by id',
        description: 'Only the name and status can be updated',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The user has been successfully updated.',
        type: ReadUserDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'The user does not exist.',
        type: ErrorResponse,
    })
    update(
        @Param() { id }: Uuid,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<ReadUserDto> {
        return this.usersService.update(id, updateUserDto)
    }
}
