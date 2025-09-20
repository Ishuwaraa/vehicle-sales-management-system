import { axiosInstance } from "../lib/axios";
import type { UserLogin, UserLoginResponse } from "../types/user.types";

export const authService = {
    login: async (loginRequest: UserLogin): Promise<{ user: UserLoginResponse | null, status: number, message?: string }> => {
        const response = await axiosInstance.post('/auth/login', loginRequest);

        if (response.status !== 200) {
            return { user: null, status: response.status, message: response.data?.message };
        }

        return { user: response.data, status: response.status };
    }
}