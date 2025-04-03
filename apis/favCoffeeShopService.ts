import instance from "./axiosInterceptors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const URL = `${BASE_URL}/api/favorite-coffee-shops`;

export interface CreateFavoriteCoffeeShopData {
    user_id: number;
    coffee_shop_id: number;
}

export interface UpdateFavoriteCoffeeShopData {
    user_id: number;
    coffee_shop_id: number;
    is_favorite: boolean;
}

export const getFavoriteCoffeeShopsByUserId = async (userId: number) => {
    try {
        const response = await instance.get(`${URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addFavoriteCoffeeShop = async (data: CreateFavoriteCoffeeShopData) => {
    try {
        const response = await instance.post(`${URL}/`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateFavoriteCoffeeShop = async (userId: number, coffeeShopId: number, isFavorite: boolean) => {
    try {
        const response = await instance.put(`${URL}/user/${userId}/coffee-shop/${coffeeShopId}`, { is_favorite: isFavorite });
        return response.data;
    } catch (error) {
        throw error;
    }
}