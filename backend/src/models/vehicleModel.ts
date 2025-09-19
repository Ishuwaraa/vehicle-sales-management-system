import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class Vehicle {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 255})
    vehicleType!: string

    @Column({ type: "varchar", length: 255})
    brand!: string

    @Column({ type: "varchar", length: 255})
    modelName!: string

    @Column({ type: "varchar", length: 255})
    color!: string

    @Column({ type: "varchar", length: 255})
    engineSize!: string

    @Column("int")
    year!: number

    @Column("double")
    price!: number

    @Column("text")
    description!: string

    @Column({ type: "json", nullable: true })
    images?: string[]

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}