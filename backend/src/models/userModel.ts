import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer",
}

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

    @Column({ type: "enum", enum: UserRole, default: UserRole.CUSTOMER })
    role!: UserRole

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}