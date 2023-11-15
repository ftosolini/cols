import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Feature {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ nullable: false })
    name!: string

    @Column({ nullable: false })
    latitude!: number

    @Column({ nullable: false })
    longitude!: number

    @Column({
        type: 'json',
        nullable: false,
        default: () => "'{}'",
    })
    properties!: Record<string, any>
}
