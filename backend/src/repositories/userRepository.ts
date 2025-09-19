import { AppDataSource } from "../data-source.js";
import User from "../models/userModel.js";

const getUserRepository = () => AppDataSource.getRepository(User);

export const addUser = async (userData: Partial<User>): Promise<User> => {
    const userRepository = getUserRepository();
    const user = userRepository.create(userData);
    return await userRepository.save(user);
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const userRepository = getUserRepository();
    return await userRepository.findOne({ where: { email } });
}

export const findUserById = async (id: string): Promise<User | null> => {
    const userRepository = getUserRepository();
    return await userRepository.findOne({ where: { id } });
}