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
    properties!: Record<string, any>
}
