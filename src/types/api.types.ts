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
    data_conclusao?: string;
    numero_sorteado?: string;
    criado_em: string;
    min_quantidade_compra?: number;
    ganhador?: {
        nome: string;
        cidade?: string;
        estado?: string;
        telefone: string;
        numero_sorteado: string;
        premio: string;
        data_conclusao: string;
    };
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
    status: 'pendente' | 'aprovado' | 'pago' | 'cancelado' | 'expirado';
    criado_em: string; // Backend usa 'criado_em'
    expira_em?: string; // Prazo de expiração (10 minutos)
    data_pagamento?: string;
    campanha?: Campanha; // Included in /api/meus-titulos response
    titulos?: Titulo[]; // Included in /api/meus-titulos response
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
    numero: string; // Backend usa 'numero'
    is_ganhador?: boolean;
    data_criacao?: string;
    campanha?: Campanha;
}

export interface MeusTitulosResponse {
    compras: (Compra & { titulos: Titulo[] })[];
    total: number;
    paginas: number;
    pagina_atual: number;
}

// ============================================
// TIPOS DE TÍTULOS PREMIADOS
// ============================================

export interface TituloPremiado {
    id: number;
    campanha_id: number;
    numero_titulo: string;
    valor_premio: number;
    ganhador_nome: string | null;
    ganhador_usuario_id: number | null;
    status: 'disponivel' | 'ganho';
    data_sorteio: string | null;
    criado_em: string;
    atualizado_em: string;
    dono?: {
        compra_id: number;
        titulo_id: number;
        usuario_id: number;
        nome: string;
        telefone: string;
    } | null;
}

export interface TitulosPremiadosResponse {
    titulos_premiados: TituloPremiado[];
    total: number;
    ganhos: number;
    disponiveis: number;
}

export interface AdicionarTituloPremiadoData {
    numero_titulo: string;
    valor_premio: number;
}

export interface MarcarGanhadorData {
    ganhador_nome: string;
    ganhador_usuario_id?: number;
    data_sorteio?: string;
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

// ============================================
// TIPOS DE PAGAMENTO E CHECKOUT
// ============================================

export interface DadosPagamentoPix {
    tipo: 'pix';
    qr_code: string;
    qr_code_base64: string;
    pix_code?: string; // Resiliência: usado no backend
    copia_cola: string;
    payment_id?: string;
    expira_em: string;
    instrucoes: string;
}

export interface CheckoutResponse {
    mensagem: string;
    compra_id: number | string;
    public_id?: string;
    status_pagamento: 'pendente' | 'aprovado' | 'cancelado' | 'recusado' | 'expirado';
    valor_total: number;
    metodo_pagamento: string;
    pagamento: DadosPagamentoPix;
    compra: CompraDetalhada;
}

export interface CompraDetalhada extends Omit<Compra, 'titulos'> {
    campanha?: Campanha;
    titulos: TituloCompra[];
}

export interface TituloCompra {
    id: number;
    numero: string;
    is_ganhador: boolean;
}

export interface StatusPagamento {
    compra_id: number | string;
    status_pagamento: 'pendente' | 'aprovado' | 'cancelado' | 'recusado' | 'expirado';
    metodo_pagamento: string;
    valor_total: number;
    quantidade_titulos: number;
    data_pagamento?: string;
    criado_em: string;
    expira_em?: string; // Prazo de expiração para pagamento
    campanha?: {
        id: number;
        titulo: string;
        slug: string;
        imagem_principal?: string;
        valor_titulo: number;
        total_titulos: number;
    };
    pagamento?: DadosPagamentoPix;
}

export interface CriarCheckoutData {
    campanha_id: number;
    quantidade_titulos: number;
    metodo_pagamento?: 'pix';
}

