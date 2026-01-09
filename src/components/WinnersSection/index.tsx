/**
 * Componente Winners Section
 * View Layer - MVC Pattern
 */

import React from 'react';
import WinnerCard from '../WinnerCard';
import type { Winner } from '../../models/types';

interface WinnersSectionProps {
    winners: Winner[];
}

const WinnersSection: React.FC<WinnersSectionProps> = ({ winners }) => {
    if (winners.length === 0) return null;

    return (
        <div className="winners-section" id="ganhadores">
            <div className="container">
                <div className="winners-header">
                    <span className="winners-icon">🎉</span>
                    <div className="winners-title-group">
                        <h2 className="winners-title">Ganhadores</h2>
                        <p className="winners-subtitle">sorteados</p>
                    </div>
                </div>

                <div className="winners-list">
                    {winners.map((winner) => (
                        <WinnerCard key={winner.id} winner={winner} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WinnersSection;
