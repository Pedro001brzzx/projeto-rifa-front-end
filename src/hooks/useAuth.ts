/**
 * Hook de Autenticação
 * Controller Layer - MVC Pattern
 */

import { useState, useEffect } from 'react';
import type { User } from '../models/types';
import * as authService from '../services/authService';

export const useAuth = () => {
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already authenticated on mount
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.login(cpf, password);
            setUser(response.user);
            clearLoginForm();
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
            setError(errorMessage);
            console.error('Login error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        clearLoginForm();
    };

    const clearLoginForm = () => {
        setCpf('');
        setPassword('');
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';

    return {
        cpf,
        password,
        user,
        isLoading,
        error,
        isAuthenticated,
        isAdmin,
        setCpf,
        setPassword,
        handleLogin,
        handleLogout,
        clearLoginForm
    };
};
