import instance from "./axiosInterceptors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const URL = `${BASE_URL}/api/coffee-shop-ratings`;

// Define TypeScript interfaces
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    // Add other user fields if needed
}

export interface Rating {
    id: number;
    user_id: number;
    coffee_shop_id: number;
    comment: string;
    rating: number;
    show: boolean;
    created_at?: string;
    updated_at?: string;
    user?: User; // From the 'with('user')' relationship
}

export interface RatingResponse {
    status: string;
    message?: string;
    data: Rating | Rating[];
}

export interface CreateRatingData {
    user_id: number;
    coffee_shop_id: number;
    comment: string;
    rating: number;
}

export interface UpdateRatingData {
    comment?: string;
    rating?: number;
}

/**
 * Get all ratings for a specific coffee shop
 */
export const getCoffeeShopRatings = async (coffeeShopId: number) => {
    try {
        const response = await instance.get<RatingResponse>(`${URL}/coffee-shop/${coffeeShopId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Create a new rating
 */
export const createRating = async (data: CreateRatingData) => {
    try {
        const response = await instance.post<RatingResponse>(URL, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Update an existing rating
 */
export const updateRating = async (id: number, data: UpdateRatingData) => {
    try {
        const response = await instance.put<RatingResponse>(`${URL}/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete (soft delete) a rating
 */
export const deleteRating = async (id: number) => {
    try {
        const response = await instance.delete<RatingResponse>(`${URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Helper function to calculate average rating
 */
export const calculateAverageRating = (ratings: Rating[]): number => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / ratings.length).toFixed(1));
};

/**
 * Helper function to get rating distribution
 */
export const getRatingDistribution = (ratings: Rating[]): Record<number, number> => {
    const distribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };

    ratings.forEach(rating => {
        distribution[rating.rating]++;
    });

    return distribution;
}; 