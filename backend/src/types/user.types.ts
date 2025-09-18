export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin';
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