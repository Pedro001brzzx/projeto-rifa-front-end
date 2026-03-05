/**
 * Data Mappers
 * Funções para mapear dados da API para interfaces do frontend
 */

import type { Campanha } from '../types/api.types';
import type { Campaign } from '../models/types';

/**
 * Mapeia dados de campanha da API para interface do frontend
 */
export const mapCampanhaToFrontend = (campanha: Campanha): Campaign => {
    // Extrair primeira linha da descrição como subtitle (guard against null)
    const subtitle = campanha.descricao
        ? campanha.descricao.split('\n')[0].substring(0, 100)
        : '';

    return {
        id: campanha.id,
        title: campanha.titulo,
        subtitle: subtitle || campanha.titulo,
        description: campanha.descricao,
        regulamento: campanha.regulamento,
        image: campanha.imagem_principal,
        price: campanha.valor_titulo,
        totalTickets: campanha.total_titulos,
        soldTickets: campanha.titulos_vendidos,
        availableTickets: campanha.titulos_disponiveis,
        soldPercentage: campanha.percentual_vendido,
        status: campanha.status === 'ativo' ? 'active' : 'concluded',
        code: campanha.codigo,
        prize: campanha.premio,
        type: campanha.tipo,
        date: campanha.data_sorteio,
        slug: campanha.slug,
        conclusionDate: campanha.data_conclusao,
        createdAt: campanha.criado_em,
        minQuantity: campanha.min_quantidade_compra || 1
    };
};

/**
 * Mapeia array de campanhas
 */
export const mapCampanhasToFrontend = (campanhas: Campanha[]): Campaign[] => {
    return campanhas.map(mapCampanhaToFrontend);
};
