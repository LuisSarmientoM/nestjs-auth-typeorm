import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class ErrorResponse {
    @ApiProperty({
        examples: [
            HttpStatus.BAD_REQUEST,
            HttpStatus.CONFLICT,
            HttpStatus.NOT_FOUND,
            HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.FORBIDDEN,
        ],
        example: HttpStatus.BAD_REQUEST,
    })
    statusCode: number

    @ApiProperty({
        example: new Date().toISOString(),
    })
    timestamp: string

    @ApiProperty({
        example: '/lorem/ipsum',
    })
    path: string

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    })
    message: string
}
