/**
 * Componente Winners Section
 * View Layer - MVC Pattern
 */

import React from 'react';
import WinnerCard from '../WinnerCard';
import type { Winner } from '../../models/types';
import './WinnersSection.css';

interface WinnersSectionProps {
    winners: Winner[];
}

const WinnersSection: React.FC<WinnersSectionProps> = ({ winners }) => {
    return (
        <div className="winners-section" id="ganhadores">
            <div className="container">
                <div className="winners-header">
                    <div className="winners-branding">
                        <span className="brand-text">o presente da</span>
                        <span className="brand-highlight">sorte</span>
                        <span className="brand-icon">🍀</span>
                    </div>
                </div>

                {winners.length > 0 ? (
                    <div className="winners-list">
                        {winners.map((winner) => (
                            <WinnerCard key={winner.id} winner={winner} />
                        ))}
                    </div>
                ) : (
                    <div className="no-winners-home">
                        <p>Ainda não temos ganhadores. Seja o primeiro!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WinnersSection;
