/**
 * Hook de Autenticação
 * Controller Layer - MVC Pattern
 * 
 * NOTE: This is a legacy hook. Consider using AuthContext instead.
 */

import { useState, useEffect } from 'react';
import type { User } from '../models/types';
import { authService } from '../services/authService';

export const useAuth = () => {
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is already authenticated on mount
    useEffect(() => {
        // DEV MODE: Auto-login with mock user
        const devMode = import.meta.env.VITE_DEV_MODE === 'true';

        if (devMode) {
            const mockUser: User = {
                id: '1',
                name: 'Usuário de Teste',
                cpf: '12345678900',
                role: 'user'
            };
            setUser(mockUser);
            console.log('🔓 DEV MODE: Mock user automatically logged in');
            return;
        }

        // Check if token exists and try to load user profile
        const loadUser = async () => {
            const token = authService.getToken();
            if (token) {
                try {
                    const response = await authService.obterPerfil();
                    const usuario = response.data;
                    // Map API user to local User type
                    const mappedUser: User = {
                        id: usuario.id.toString(),
                        name: usuario.nome,
                        cpf: usuario.cpf,
                        role: usuario.is_admin ? 'admin' : 'user'
                    };
                    setUser(mappedUser);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    // Token might be invalid, remove it
                    await authService.logout();
                }
            }
        };

        loadUser();
    }, []);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Use phone/telefone for login (the API uses telefone, but we accept cpf for backward compatibility)
            const response = await authService.login(cpf, password);
            const usuario = response.data.usuario;

            // Map API user to local User type
            const mappedUser: User = {
                id: usuario.id.toString(),
                name: usuario.nome,
                cpf: usuario.cpf,
                role: usuario.is_admin ? 'admin' : 'user'
            };

            setUser(mappedUser);
            clearLoginForm();
            return response.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
            setError(errorMessage);
            console.error('Login error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
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
