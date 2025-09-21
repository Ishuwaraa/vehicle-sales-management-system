import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import type { UserLogin, UserLoginResponse } from "../types/user.types";

export const authService = {
    login: async (loginRequest: UserLogin): Promise<{ user: UserLoginResponse | null, status: number, message?: string }> => {
        try {
            const response = await axiosInstance.post('/auth/login', loginRequest);
    
            return { user: response.data, status: response.status };
        } catch (err: any) {
            console.log(err.response);

            if (err instanceof AxiosError) {
                return { user: null, status: err.response!.status, message: err.response!.data.message };
            }

            return { user: null, status: err.response.status, message: err.message };
        }
    },

    logout: async (): Promise<{ status: number, message?: string }> => {
        try {
            const response = await axiosInstance.get('/auth/logout');
    
            localStorage.removeItem('token');
    
            return { status: response.status };
        } catch (err: any) {
            console.log(err.response);

            if (err instanceof AxiosError) {
                return { status: err.response!.status, message: err.response!.data.message };
            }
            return { status: err.response.status, message: err.response.data?.message };
        }
    }
}