import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class changePasswordDto {
    @ApiProperty({
        example: '123456',
        description: 'User password',
    })
    @IsNotEmpty()
    @IsString()
    password: string

    @ApiProperty({
        example: '123456',
        description: 'User password',
    })
    @IsNotEmpty()
    @IsString()
    repeatPassword: string
}
