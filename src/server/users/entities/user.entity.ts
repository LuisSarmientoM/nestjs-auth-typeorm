import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm'

import { UserRoles } from './user-role.entity'

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: false })
    email: string

    @Column({ nullable: true })
    password: string

    @Column()
    name: string

    @ManyToOne(() => UserRoles, (userRole) => userRole.id, {
        eager: true,
    })
    @JoinColumn()
    role: UserRoles

    @Column({ type: 'bool', default: true })
    isActive: boolean

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date
}
