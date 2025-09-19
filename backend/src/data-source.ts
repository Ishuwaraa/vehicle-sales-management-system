import { DataSource } from "typeorm";
import User from "./models/userModel.js";
import Vehicle from "./models/vehicleModel.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    timezone: 'z',  //incorrect timezons with db and orm w/o this
    logging: process.env.NODE_ENV === 'development',
    entities: [User, Vehicle],
})

export const initializeDataSource = async () => {
    try {
        await AppDataSource.initialize()
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
    }
}