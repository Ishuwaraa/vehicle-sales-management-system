import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ENVIRONMENT === 'dev'
    ? 'http://localhost:4000/api/'
    : 'http://localhost:4000/api/',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_ENVIRONMENT === 'dev'
    ? 'http://localhost:4000/api/'
    : 'http://localhost:4000/api/',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})