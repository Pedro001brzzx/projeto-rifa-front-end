/**
 * PrizeTitles Component
 * Displays prize-winning ticket numbers with values and winners
 * Now integrated with backend database
 */

import React from 'react';
import './PrizeTitles.css';
import type { TituloPremiado } from '../../types/api.types';

interface PrizeTitlesProps {
    prizes: TituloPremiado[];
    totalCount?: number;
    wonCount?: number;
}

const PrizeTitles: React.FC<PrizeTitlesProps> = ({
    prizes,
    totalCount,
    wonCount
}) => {
    // If counts not provided, calculate from prizes array
    const calculatedWonCount = wonCount ?? prizes.filter(p => p.status === 'ganho').length;
    const calculatedTotalCount = totalCount ?? prizes.length;

    // Don't render if no prizes
    if (!prizes || prizes.length === 0) {
        return null;
    }

    return (
        <div className="prize-titles-section">
            <div className="section-header">
                <h3>🏆 Títulos Premiados</h3>
                <span className="badge-count">
                    {calculatedWonCount}/{calculatedTotalCount}
                </span>
            </div>
            <div className="prize-list">
                {prizes.map((prize) => (
                    <div
                        key={prize.id}
                        className={`prize-item ${prize.status === 'ganho' ? 'won' : 'available'}`}
                    >
                        <span className="prize-number">{prize.numero_titulo}</span>
                        <span className="prize-value">
                            R${prize.valor_premio.toFixed(2).replace('.', ',')} REAIS
                        </span>
                        <span className="prize-winner">
                            {prize.status === 'ganho' && prize.ganhador_nome ? (
                                <>{prize.ganhador_nome} 🏆</>
                            ) : (
                                'Disponível'
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrizeTitles;
