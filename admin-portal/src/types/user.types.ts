export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserLoginResponse {
    accessToken: string;
    id: string;
}