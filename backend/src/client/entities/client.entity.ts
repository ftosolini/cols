import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ClientEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ nullable: false })
    name!: string

    @Column({ nullable: true })
    logo?: string

    @Column({ nullable: false })
    subdomain!: string
}
