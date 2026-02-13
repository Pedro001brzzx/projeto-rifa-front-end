/**
 * Tipos e Interfaces do Projeto
 * Model Layer - MVC Pattern
 */

export interface Campaign {
    id: number;
    title: string;
    subtitle: string;
    description?: string;
    image: string;
    status: 'active' | 'concluded';
    price: number;
    totalTickets: number;
    soldTickets: number;
    availableTickets?: number;
    soldPercentage?: number;
    code?: string;
    prize?: string;
    type?: string;
    date?: string;
    slug?: string;
    createdAt?: string;
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
    password: string;
    confirmPassword: string;
    birthDate: string;
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    state: string;
    city: string;
    complement: string;
}

export interface Purchase {
    id: number;
    campaignId: number;
    userId: number;
    quantity: number;
    totalAmount: number;
    purchaseDate: string;
    status_pagamento?: 'pendente' | 'aprovado' | 'cancelado' | 'recusado' | 'expirado';
    expira_em?: string;
    campaign?: Campaign;
    titulos?: {
        id: number;
        numero: string;
        is_ganhador?: boolean;
    }[];
}
