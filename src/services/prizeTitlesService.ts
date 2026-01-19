import api from './api';
import type {
    TitulosPremiadosResponse,
    AdicionarTituloPremiadoData,
    MarcarGanhadorData
} from '../types/api.types';

/**
 * Prize Titles Service
 * Handles all API calls related to prize titles
 */
class PrizeTitlesService {
    /**
     * Get prize titles for a campaign (Public endpoint)
     * @param campaignSlug - The campaign slug
     * @returns Promise with prize titles data
     */
    async getPrizeTitles(campaignSlug: string): Promise<TitulosPremiadosResponse> {
        try {
            const response = await api.get(`/campanhas/${campaignSlug}/titulos-premiados`);
            return response.data;
        } catch (error) {
            console.error('Error fetching prize titles:', error);
            // Return empty state if endpoint doesn't exist yet
            return {
                titulos_premiados: [],
                total: 0,
                ganhos: 0,
                disponiveis: 0
            };
        }
    }

    /**
     * Add new prize title (Admin only)
     * @param campaignId - The campaign ID
     * @param data - Prize title data
     */
    async addPrizeTitle(
        campaignId: number,
        data: AdicionarTituloPremiadoData
    ): Promise<void> {
        await api.post(`/admin/campanhas/${campaignId}/titulos-premiados`, data);
    }

    /**
     * Mark winner for a prize title (Admin only)
     * @param prizeTitleId - The prize title ID
     * @param data - Winner data
     */
    async markWinner(
        prizeTitleId: number,
        data: MarcarGanhadorData
    ): Promise<void> {
        await api.patch(`/admin/titulos-premiados/${prizeTitleId}/ganhador`, data);
    }

    /**
     * Delete prize title (Admin only)
     * @param prizeTitleId - The prize title ID
     */
    async deletePrizeTitle(prizeTitleId: number): Promise<void> {
        await api.delete(`/admin/titulos-premiados/${prizeTitleId}`);
    }
}

export const prizeTitlesService = new PrizeTitlesService();
