import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class Uuid {
    @Expose()
    @ApiProperty({
        example: 'f0a0b0c0-d0e0-4b0a-9b0a-0c0d0e0f0a0b',
        description: 'The id of the user',
    })
    @IsNotEmpty()
    @IsUUID()
    id: string
}
