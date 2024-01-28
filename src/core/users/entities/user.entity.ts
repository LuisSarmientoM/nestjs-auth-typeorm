import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ nullable: false })
    email!: string

    @Column({ nullable: true })
    password!: string

    @Column()
    name!: string

    @Column({ type: 'bool', default: true })
    isActive!: boolean

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date
}
