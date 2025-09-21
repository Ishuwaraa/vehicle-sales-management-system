export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserRegister {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}