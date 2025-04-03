import instance from "./axiosInterceptors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const URL = `${BASE_URL}/api/users`;

interface UserRegistrationData {
    name: string;
    email: string;
    password: string;
    provider?: string;
    provider_id?: string;
    avatar?: string;
}

interface UserLoginData {
    email: string;
    password: string;
}

interface UserUpdateData {
    name?: string;
    password?: string;
    avatar?: string;
}

export const registerUser = async (data: UserRegistrationData) => {
    try {
        const response = await instance.post(`${URL}/register`, data);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (data: UserLoginData) => {
    try {
        const response = await instance.post(`${URL}/login`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const loginWithGoogle = async () => {
    try {
        const response = await instance.get(`${URL}/google`);
        const authUrl = response.data.data.url;
        window.location.href = authUrl;
        return authUrl;
    } catch (error) {
        console.error('Error logging in with Google:', error);
        throw error;
    }
};

export const updateUser = async (data: UserUpdateData, token?: string) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await instance.put(`${URL}/update`, data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const checkLoginStatus = async () => {
    try {
        const response = await instance.get(`${URL}/me`);
        return response.data.data;
    } catch (error) {
        console.error('Error checking auth status:', error);
        throw error;
    }
};