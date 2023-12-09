import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Feature {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ nullable: false })
    name!: string

    @Column('double', { nullable: false })
    latitude!: number

    @Column('double', { nullable: false })
    longitude!: number

    @Column({
        type: 'json',
        nullable: false,
        default: () => "'{}'",
    })
    /* eslint-disable @typescript-eslint/no-explicit-any */
    properties!: Record<string, any>

    @Column({ nullable: false })
    clientId!: string
}
