import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class Email {
    @Expose()
    @ApiProperty({
        example: 'john@mail.com',
        description: 'The email of the user',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string
}
