import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LocalLoginDto {
    @ApiProperty({
        example: 'john@doe.com',
    })
    @IsNotEmpty()
    @IsString()
    email: string

    @ApiProperty({
        example: 'Pass.word',
    })
    @IsNotEmpty()
    @IsString()
    // @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message:
    //         'The password must have a Uppercase, lowercase letter and a number',
    // })
    password: string
}
