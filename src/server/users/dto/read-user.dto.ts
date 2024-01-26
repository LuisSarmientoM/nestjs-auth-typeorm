import { Uuid } from '@models/id.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class ReadUserDto extends Uuid {
    @Expose()
    @ApiProperty({
        example: 'john@doe.com',
        description: 'The email of the user',
    })
    email: string

    @Expose()
    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
    })
    name: string

    @Expose()
    @ApiProperty({
        example: true,
        description: 'The status of the user',
    })
    isActive: boolean
}

@Exclude()
export class ReadUserWithRoleDto extends ReadUserDto {
    @Expose()
    @ApiProperty({
        example: 'admin',
        description: 'The role of the user',
    })
    role: string
}
