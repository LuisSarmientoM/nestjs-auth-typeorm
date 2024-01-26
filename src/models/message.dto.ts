import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class MessageDto {
    @Expose()
    @ApiProperty({
        example: 'lorem ipsum',
        description:
            'Message Response message with the server makes a request and the server returns a warning to the user.',
    })
    @IsNotEmpty()
    @IsEmail()
    message: string
}
