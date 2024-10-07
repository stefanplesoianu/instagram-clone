import axios from 'axios';
import { getToken, getGuestToken } from '../utils/tokenManager';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// using interceptor to attach tokens automatically
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        const guestToken = getGuestToken();

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else if (guestToken) {
            config.headers['Authorization'] = `Bearer ${guestToken}`;
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

export default api;
