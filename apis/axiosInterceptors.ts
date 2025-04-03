import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response || error.response.status === 401) {
            localStorage.removeItem('auth_token');
            // Optionally dispatch an event to notify the app about authentication failure
            window.dispatchEvent(new CustomEvent('auth:failed'));
        }
        return Promise.reject(error);
    }
);

export default instance; 