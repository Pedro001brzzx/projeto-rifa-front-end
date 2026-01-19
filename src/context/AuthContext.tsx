// Context de Autenticação
// Cole este arquivo em: src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { Usuario, RegistroData } from '../types/api.types';

interface AuthContextType {
    user: Usuario | null;
    loading: boolean;
    authenticated: boolean;
    login: (telefone: string, senha: string) => Promise<any>;
    register: (dados: RegistroData) => Promise<any>;
    logout: () => Promise<void>;
    updateProfile: (dados: Partial<Usuario>) => Promise<any>;
    isAdmin: boolean;
    // Backward compatibility properties
    telefone?: string;
    phone?: string; // Alias
    cpf?: string; // Legacy support - maps to telefone
    password?: string;
    isLoading?: boolean;
    error?: string | null;
    isAuthenticated?: boolean;
    setTelefone?: (value: string) => void;
    setPhone?: (value: string) => void; // Alias
    setCpf?: (value: string) => void; // Legacy support - maps to setTelefone
    setPassword?: (value: string) => void;
    handleLogin?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<any>;
    handleLogout?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    // Use telefone (phone) for login instead of CPF
    const [telefone, setTelefone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Carregar perfil do usuário ao iniciar
    useEffect(() => {
        const loadUserProfile = async () => {
            const token = authService.getToken();

            if (token) {
                try {
                    const response = await authService.obterPerfil();
                    console.log('Dados do usuário:', response.data);
                    setUser(response.data);
                    setAuthenticated(true);
                } catch (error) {
                    console.error('Erro ao carregar perfil:', error);
                    await authService.logout();
                }
            }

            setLoading(false);
        };

        loadUserProfile();
    }, []);


    const login = async (telefone: string, senha: string) => {
        try {
            setLoading(true);
            setError(null);
            const cleanTelefone = telefone.replace(/\D/g, '');
            const loginResponse = await authService.login(cleanTelefone, senha);

            // Debug: Decode JWT to check for admin claims
            try {
                const token = loginResponse.data.token;
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                console.log('Decoded Token Payload:', JSON.parse(jsonPayload));
            } catch (e) {
                console.warn('Error decoding token:', e);
            }

            // Fetch full profile to ensure we have all fields including is_admin
            // The login response might be incomplete
            localStorage.setItem('token', loginResponse.data.token);
            const profileResponse = await authService.obterPerfil();



            setUser(profileResponse.data);
            setAuthenticated(true);
            setTelefone('');
            setPassword('');
            return loginResponse.data;
        } catch (err: any) {
            setAuthenticated(false);

            // Map API errors to user-friendly messages
            let errorMessage = 'Erro ao fazer login. Tente novamente.';

            if (err.response) {
                // The request was made and the server responded with a status code
                const statusCode = err.response.status;

                switch (statusCode) {
                    case 401:
                        errorMessage = 'Telefone ou senha incorretos';
                        break;
                    case 404:
                        errorMessage = 'Usuário não encontrado';
                        break;
                    case 422:
                        errorMessage = 'Dados inválidos. Verifique o telefone e senha';
                        break;
                    case 500:
                        errorMessage = 'Erro no servidor. Tente novamente mais tarde';
                        break;
                    default:
                        // Check if there's a message from the API
                        if (err.response.data?.mensagem) {
                            errorMessage = err.response.data.mensagem;
                        } else if (err.response.data?.message) {
                            errorMessage = err.response.data.message;
                        } else {
                            errorMessage = `Erro ${statusCode}. Tente novamente`;
                        }
                }
            } else if (err.request) {
                // The request was made but no response was received
                errorMessage = 'Sem conexão com o servidor. Verifique sua internet';
            } else if (err.message) {
                // Something else happened while setting up the request
                errorMessage = err.message;
            }

            console.error('Login error:', err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    // Backward compatibility login handler
    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        return await login(telefone, password);
    };

    const register = async (dados: RegistroData) => {
        try {
            const response = await authService.registro(dados);
            setUser(response.data.usuario);
            setAuthenticated(true);
            return response.data;
        } catch (error) {
            setAuthenticated(false);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
            setAuthenticated(false);
            setTelefone('');
            setPassword('');
        }
    };

    const updateProfile = async (dados: Partial<Usuario>) => {
        try {
            const response = await authService.atualizarPerfil(dados);
            setUser(response.data.usuario);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        authenticated,
        login,
        register,
        logout: handleLogout,
        updateProfile,
        isAdmin: !!(user?.is_admin || user?.role === 'admin'),
        // Backward compatibility
        telefone,
        phone: telefone, // Alias
        cpf: telefone, // Legacy support - map to telefone
        password,
        isLoading: loading,
        error,
        isAuthenticated: authenticated,
        setTelefone,
        setPhone: setTelefone, // Alias  
        setCpf: setTelefone, // Legacy support - map to setTelefone
        setPassword,
        handleLogin,
        handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export both useAuth and useAuthContext for compatibility
export const useAuthContext = useAuth;

export default AuthContext;
