import { axiosInstance } from "../lib/axios";
import useAuth from "./useAuth";

interface RefreshResponse {
    accessToken: string| null;
    status: number,
    message?: string
}

const useRefreshToken = (): (() => Promise<RefreshResponse>) => {
    const { setAuth }: any = useAuth();

    const refresh = async (): Promise<RefreshResponse> => {
        
        const response = await axiosInstance.get('/auth/refresh-token');
        console.log('refresh end point ', response);

        if (response.status !== 200) {
            return { accessToken: null, status: response.status, message: response.data?.message };
        }

        setAuth((prevState: any) => {
            //spreading prevState to let the other properties of the auth object staty the same and override the access token only
            return { ...prevState, accessToken: response.data.accessToken }
        });

        return { accessToken: response.data.accessToken, status: response.status };
    }

    return refresh;
}

export default useRefreshToken;