import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class RecoveryPassword extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    token: string

    @Column()
    userId: string
}
