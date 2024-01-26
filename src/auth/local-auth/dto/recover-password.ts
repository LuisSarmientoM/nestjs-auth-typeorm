import { ApiProperty } from '@nestjs/swagger'
import { changePasswordDto } from '@server/users/dto/change-password.dto'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

/**
 * RecoveryPasswordDto is a data transfer object used for password recovery requests.
 * It extends the changePasswordDto and adds a token property.
 * The token is sent to the user's email to change the password.
 */
export class RecoveryPasswordDto extends changePasswordDto {
    @Expose()
    @ApiProperty({
        example: 'a1b2c3d4e5f6g7h8i9j0',
        description: 'Token sent to the user email to change the password',
    })
    @IsString()
    token: string
}
