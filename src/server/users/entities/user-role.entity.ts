import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity('user_roles')
export class UserRoles {
    @ApiProperty()
    @PrimaryColumn()
    id: number

    @ApiProperty()
    @Column()
    name: string

    @ApiProperty()
    @Column()
    code: string

    @ApiProperty()
    @Column()
    description: string
}
