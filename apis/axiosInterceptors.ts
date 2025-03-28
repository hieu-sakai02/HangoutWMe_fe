import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
instance.interceptors.request.use(
    (config) => {
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
            console.error('Server response error:', error);
        }
        return Promise.reject(error);
    }
);

export default instance; 