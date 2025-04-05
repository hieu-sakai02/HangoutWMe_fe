'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import instance from '@/apis/axiosInterceptors';
// API
import { checkLoginStatus } from '@/apis/userService';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    provider: string;
    dob: string | null;
    address: string | null;
    token: string;
    isAdmin: boolean;
}

const UserContext = createContext<{
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}>({
    currentUser: null,
    setCurrentUser: () => { },
});

const checkAuthStatus = async (): Promise<User | null> => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
        const userData = await checkLoginStatus();

        // Construct the complete user object
        const user: User = {
            ...userData.user,
            token: token // Use the token from localStorage or userData.token
        };

        return user;
    } catch (error) {
        localStorage.removeItem('auth_token');
        return null;
    }
};

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const user = await checkAuthStatus();
                if (user) {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const updateCurrentUser = (user: User | null) => {
        setCurrentUser(user);
        if (user?.token) {
            localStorage.setItem('auth_token', user.token);
        } else {
            localStorage.removeItem('auth_token');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser: updateCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext); 