import useRefreshToken from './useRefresh';
import useAuth from './useAuth';
import { useEffect } from 'react';
import { axiosPrivate } from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth }: any = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                //if the request doesnt has an authoriazation header setting it w one
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        //runs after receiving a response
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,   //letting the response pass through w/o modifying if it was a success
            async (error) => {
                const prevRequest = error?.config;
                //if access token expired or invalid and prevRequest has not already been retried
                if(error?.response?.status === 403 && !prevRequest?.sent) {
                    const errorMessage = error?.response?.data?.message;
                    // console.log(errorMessage);

                    if (errorMessage === 'Token expired') {
                        prevRequest.sent = true;    //preventing the interceptior from repeatedly retrying the same req in case of multiple 403 responses
                        
                        try {
                            const refreshResponse = await refresh();

                            if (refreshResponse.status !== 200) {
                                console.error(refreshResponse.message);
                                localStorage.removeItem('token');
                                navigate('/login', { replace: true })
                                return
                            }

                            prevRequest.headers['Authorization'] = `Bearer ${refreshResponse.accessToken}`;
                            return axiosPrivate(prevRequest);
                        } catch (err) {
                            //refresh fails logout
                            localStorage.removeItem('token');
                            navigate('/login', { replace: true })
                            return Promise.reject(err);
                        }
                    } else if (errorMessage === 'Invalid token') {
                        localStorage.removeItem('token');
                        navigate('/login', { replace: true })
                        return Promise.reject(error);
                    }
                }
                
                return Promise.reject(error);   //if the error is not 403 or request has alr been retried
            }
        );

        return () => {
            //removing interceptors when the hook is unmounted or auth or refresh changes
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
        
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;