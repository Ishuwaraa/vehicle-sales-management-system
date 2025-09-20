import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ENVIRONMENT === 'dev'
    ? 'http://localhost:4000/api/'
    : 'http://localhost:4000/api/',
});