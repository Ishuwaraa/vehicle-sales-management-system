import { DataSource } from "typeorm";
import User from "../src/models/userModel";
import Vehicle from "../src/models/vehicleModel";

export const TestDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "vms_test_db",
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User, Vehicle],
})

export const setupTestDatabase = async () => {
    if (!TestDataSource.isInitialized) {
        await TestDataSource.initialize();
    }
};

export const teardownTestDatabase = async () => {
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
    }
};

export const clearTestDatabase = async () => {
    if (TestDataSource.isInitialized) {
        const entities = TestDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = TestDataSource.getRepository(entity.name);
            await repository.clear();
        }
    }
};