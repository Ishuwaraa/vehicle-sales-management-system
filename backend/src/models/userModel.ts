import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "varchar", length: 255 })
    name!: string

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string

    @Column({ type: "varchar", length: 20 })
    phone!: string

    @Column({ type: "varchar", length: 255 })
    password!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}