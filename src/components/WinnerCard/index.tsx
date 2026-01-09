/**
 * Componente Winner Card
 * View Layer - MVC Pattern
 */

import React from 'react';
import { User } from 'lucide-react';
import type { Winner } from '../../models/types';

interface WinnerCardProps {
    winner: Winner;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winner }) => {
    return (
        <div className="winner-card">
            <div className="winner-avatar">
                {winner.avatar ? (
                    <img src={winner.avatar} alt={winner.name} />
                ) : (
                    <User size={32} strokeWidth={1.5} />
                )}
            </div>

            <div className="winner-info">
                <h3 className="winner-name">{winner.name}</h3>
                <p className="winner-campaign">{winner.campaignTitle}</p>

                <ul className="winner-details">
                    <li>Prêmio: {winner.prize}</li>
                    <li>Número da sorte: <strong>{winner.luckyNumber}</strong></li>
                    <li>Data da premiação: {winner.drawDate}</li>
                    <li>Telefone: {winner.phone}</li>
                </ul>
            </div>
        </div>
    );
};

export default WinnerCard;
