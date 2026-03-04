// Serviço de Pagamentos
// Arquivo: src/services/paymentService.ts

import type { AxiosResponse } from 'axios';
import api from './api';
import type {
    CheckoutResponse,
    StatusPagamento,
    CriarCheckoutData,
    MessageResponse
} from '../types/api.types';

export const paymentService = {
    /**
     * Cria checkout e inicia processo de pagamento PIX
     * @param dados - Dados do checkout
     * @returns Promise com dados de pagamento PIX
     */
    criarCheckout: async (dados: CriarCheckoutData): Promise<AxiosResponse<CheckoutResponse>> => {
        return await api.post<CheckoutResponse>('/api/checkout', {
            campanha_id: dados.campanha_id,
            quantidade_titulos: dados.quantidade_titulos,
            metodo_pagamento: dados.metodo_pagamento || 'pix',
        });
    },

    /**
     * Consulta status de um pagamento
     * @param compraId - ID da compra (UUID)
     * @returns Promise com status do pagamento
     */
    consultarPagamento: async (compraId: string): Promise<AxiosResponse<StatusPagamento>> => {
        return await api.get<StatusPagamento>(`/api/pagamentos/${compraId}`);
    },

    /**
     * Aprova pagamento manualmente (Admin only)
     * @param compraId - ID da compra
     * @returns Promise com mensagem de sucesso
     */
    aprovarPagamento: async (compraId: number | string): Promise<AxiosResponse<MessageResponse & { compra_id: number }>> => {
        return await api.post(`/api/pagamentos/${compraId}/aprovar`);
    },

    /**
     * Helper para monitorar status de pagamento (polling)
     * @param compraId - ID da compra (UUID)
     * @param onUpdate - Callback quando status mudar
     * @param interval - Intervalo em ms (padrão: 3000)
     * @returns Função para parar o polling
     */
    monitorarPagamento: (
        compraId: string,
        onUpdate: (status: StatusPagamento) => void,
        interval = 3000
    ): (() => void) => {
        let isPolling = true;
        let currentStatus: string | null = null;

        const poll = async () => {
            if (!isPolling) return;

            try {
                const response = await paymentService.consultarPagamento(compraId);
                const status = response.data;

                // Se status mudou, notificar
                if (status.status_pagamento !== currentStatus) {
                    currentStatus = status.status_pagamento;
                    onUpdate(status);
                }

                // Se foi aprovado ou cancelado/recusado, parar polling
                if (status.status_pagamento === 'aprovado' ||
                    status.status_pagamento === 'cancelado' ||
                    status.status_pagamento === 'recusado') {
                    isPolling = false;
                    return;
                }

                // Continuar polling
                setTimeout(poll, interval);
            } catch (error) {
                console.error('Erro ao monitorar pagamento:', error);
                // Tentar novamente após o intervalo
                setTimeout(poll, interval);
            }
        };

        // Iniciar polling
        poll();

        // Retornar função para parar polling
        return () => {
            isPolling = false;
        };
    },
};

export default paymentService;
