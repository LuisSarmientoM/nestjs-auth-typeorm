import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'
export class CreateUserDto {
    @ApiProperty({
        example: 'john@doe.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'John Doe',
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        required: false,
        default: true,
    })
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean = true
}
