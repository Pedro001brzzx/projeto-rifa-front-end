/**
 * Dados Mock de Ganhadores
 * Model Layer - MVC Pattern
 */

import type { Winner } from './types';

export const winners: Winner[] = [
    {
        id: '1',
        name: 'Adjair Pereira Da Silva',
        campaignTitle: 'BROS 160 2026 0KM + 1 ANO DE SEGURO',
        prize: 'Honda Bros 160 2026 0KM',
        luckyNumber: '0325361',
        drawDate: '12/11/2025',
        phone: '(83) ****-****'
    },
    {
        id: '2',
        name: 'Kelly Lima',
        campaignTitle: 'RAPIDONA FAN 160 2025 0KM',
        prize: 'Honda Fan 160 2025 0KM',
        luckyNumber: '0327092',
        drawDate: '11/10/2025',
        phone: '(84) ****-****'
    },
    {
        id: '3',
        name: 'Darlan Sousa',
        campaignTitle: 'FIAT STRADA 2024 NAS RODAS 18',
        prize: 'Fiat Strada nas rodas 18',
        luckyNumber: '6032971',
        drawDate: '13/09/2025',
        phone: '(85) ****-****'
    }
];
