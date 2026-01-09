/**
 * Authentication Service
 * Handles API calls for authentication and token management
 */

import type { User, AuthResponse } from '../models/types';

// TODO: Configure this with your actual API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Store JWT token in localStorage
 */
export const setToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
    localStorage.removeItem('auth_token');
};

/**
 * Decode JWT token to extract user information
 */
export const decodeToken = (token: string): User | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.id || payload.sub,
            name: payload.name,
            cpf: payload.cpf,
            role: payload.role || 'user'
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Login with phone and password
 */
export const login = async (cpf: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        setToken(data.token);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Logout and clear stored token
 */
export const logout = (): void => {
    removeToken();
};

/**
 * Get current user from stored token
 */
export const getCurrentUser = (): User | null => {
    const token = getToken();
    if (!token) return null;
    return decodeToken(token);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    return getToken() !== null;
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
    const user = getCurrentUser();
    return user?.role === 'admin';
};

/**
 * Get authorization headers for API requests
 */
export const getAuthHeaders = (): HeadersInit => {
    const token = getToken();
    if (!token) return {};

    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};
