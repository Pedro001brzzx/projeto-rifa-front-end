/**
 * Tipos e Interfaces do Projeto
 * Model Layer - MVC Pattern
 */

export interface Campaign {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    status: 'active' | 'concluded';
    badge?: string;
    code?: string;
    date?: string;
    price?: number;
    totalTickets?: number;
    soldTickets?: number;
    description?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface LoginFormData {
    cpf: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    cpf: string;
    role: 'user' | 'admin';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Winner {
    id: string;
    name: string;
    campaignTitle: string;
    prize: string;
    luckyNumber: string;
    drawDate: string;
    phone: string;
    avatar?: string;
}

export interface RegisterFormData {
    fullName: string;
    cpf: string;
    socialName: string;
    phone: string;
    phoneConfirmation: string;
    email: string;
    birthDate: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    state: string;
    city: string;
    complement: string;
}

