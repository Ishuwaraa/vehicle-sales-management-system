import { DataSource } from "typeorm";
import User from "./models/userModel.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [User],
})

export const initializeDataSource = async () => {
    try {
        await AppDataSource.initialize()
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
    }
}