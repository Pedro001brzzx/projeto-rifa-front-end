// Tipos da API
// Arquivo: src/types/api.types.ts

// ============================================
// TIPOS DE USUÁRIO E AUTENTICAÇÃO
// ============================================

export interface Usuario {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    cpf: string;
    cidade: string;
    estado: string;
    is_admin: boolean;
    role?: 'user' | 'admin';
    data_cadastro: string;
}

export interface RegistroData {
    nome: string;
    telefone: string;
    senha: string;
    email: string;
    cpf: string;
    cidade: string;
    estado: string;
}

export interface LoginData {
    telefone: string;
    senha: string;
}

export interface AuthResponse {
    mensagem: string;
    token: string;
    usuario: Usuario;
}

// ============================================
// TIPOS DE CAMPANHA
// ============================================

export interface Campanha {
    id: number;
    codigo: string;
    titulo: string;
    slug: string;
    descricao: string;
    tipo: string;
    premio: string;
    imagem_principal: string;
    valor_titulo: number;
    total_titulos: number;
    titulos_vendidos: number;
    titulos_disponiveis: number;
    percentual_vendido: number;
    data_sorteio: string;
    status: 'ativo' | 'concluido' | 'cancelado';
    criado_em: string;
}

export interface CampanhaParams {
    status?: 'ativo' | 'concluido' | 'cancelado';
    page?: number;
    per_page?: number;
}

export interface CampanhaListResponse {
    campanhas: Campanha[];
    total: number;
    paginas: number;
    pagina_atual: number;
}

export interface CriarCampanhaData {
    titulo: string;
    descricao: string;
    imagem_url: string;
    valor_titulo: number;
    total_titulos: number;
    data_sorteio: string;
}

// ============================================
// TIPOS DE COMPRA
// ============================================

export interface Compra {
    id: number;
    usuario_id: number;
    campanha_id: number;
    quantidade_titulos: number;
    valor_total: number;
    metodo_pagamento: string;
    status: 'pendente' | 'pago' | 'cancelado';
    data_compra: string;
}

export interface CriarCompraData {
    campanha_id: number;
    quantidade_titulos: number;
    metodo_pagamento: string;
}

export interface CompraResponse {
    mensagem: string;
    compra: Compra;
}

export interface Titulo {
    id: number;
    compra_id: number;
    campanha_id: number;
    numero_titulo: string;
    data_criacao: string;
    campanha?: Campanha;
}

export interface MeusTitulosResponse {
    compras: (Compra & { titulos: Titulo[] })[];
    total: number;
    paginas: number;
    pagina_atual: number;
}

// ============================================
// TIPOS GENÉRICOS
// ===========================================

export interface MessageResponse {
    mensagem: string;
}

export interface PaginationParams {
    page?: number;
    per_page?: number;
}
