import instance from "./axiosInterceptors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const URL = `${BASE_URL}/api/coffee-shops`;
export interface CoffeeShop {
    id: number;
    name: string;
    houseNumber: string;
    street?: string;
    ward: string;
    district: string;
    city: string;
    phone?: string;
    email?: string;
    website?: string;
    thumbnail: string;
    description: string;
    show: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CoffeeShopResponse {
    status: string;
    message?: string;
    data: CoffeeShop | CoffeeShop[];
}

export interface CreateCoffeeShopData {
    name: string;
    houseNumber: string;
    street?: string;
    ward: string;
    district: string;
    city: string;
    phone?: string;
    email?: string;
    website?: string;
    thumbnail: string;
    description: string;
}

export interface UpdateCoffeeShopData {
    name?: string;
    houseNumber?: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    phone?: string;
    email?: string;
    website?: string;
    thumbnail?: string;
    description?: string;
}

export const getAllCoffeeShops = async () => {
    try {
        const response = await instance.get(URL);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getCoffeeShopsById = async (id: number) => {
    try {
        const response = await instance.get(`${URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTop10CoffeeShops = async () => {
    try {
        const response = await instance.get(`${URL}/top-rated`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const createNewCoffeeShop = async (data: CreateCoffeeShopData) => {
    try {
        const response = await instance.post(URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateCoffeeShop = async (id: number, data: UpdateCoffeeShopData) => {
    try {
        const response = await instance.put(`${URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteCoffeeShop = async (id: number) => {
    try {
        const response = await instance.delete(`${URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}