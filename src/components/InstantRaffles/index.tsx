/**
 * InstantRaffles Component
 * Displays instant raffle combos and winners with expand/collapse functionality
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './InstantRaffles.css';

export interface RaffleCombo {
    titles: number;
    price: number;
    raffles: number;
}

export interface RaffleWinner {
    value: number;
    winner?: string;
    status: 'won' | 'available';
}

interface InstantRafflesProps {
    combos: RaffleCombo[];
    winners: RaffleWinner[];
}

const InstantRaffles: React.FC<InstantRafflesProps> = ({ combos, winners }) => {
    const [showAllWinners, setShowAllWinners] = useState(false);

    const wonCount = winners.filter(w => w.status === 'won').length;
    const totalCount = winners.length;

    // Show first 5 winners by default
    const displayedWinners = showAllWinners ? winners : winners.slice(0, 5);

    return (
        <div className="instant-raffles-section">
            {/* Combos Section */}
            <div className="raffles-subsection">
                <div className="section-header">
                    <h3>🎯 Roletas Instantâneas <span className="subsection-label">combos</span></h3>
                </div>
                <div className="combos-grid">
                    {combos.map((combo, index) => (
                        <div key={index} className="combo-card">
                            <div className="combo-header">
                                <span className="combo-label">A cada</span>
                            </div>
                            <div className="combo-titles">{combo.titles} Títulos</div>
                            <div className="combo-price">por R$ {combo.price.toFixed(2).replace('.', ',')}</div>
                            <div className="combo-reward">
                                Recebe {combo.raffles} Roleta{combo.raffles > 1 ? 's' : ''} 🎯
                            </div>
                            <div className="combo-chance">
                                {combo.raffles} chance(s) de contemplação nas Roletas Instantâneas
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Winners Section */}
            <div className="raffles-subsection">
                <div className="section-header">
                    <h3>🎯 Roletas Instantâneas <span className="subsection-label">ganhadores</span></h3>
                    <span className="badge-count">{wonCount}/{totalCount}</span>
                </div>
                <div className="winners-list">
                    {displayedWinners.map((winner, index) => (
                        <div
                            key={index}
                            className={`winner-item ${winner.status === 'won' ? 'won' : 'available'}`}
                        >
                            <span className="winner-value">
                                R${winner.value.toFixed(2).replace('.', ',')} REAIS
                            </span>
                            <span className="winner-name">
                                {winner.status === 'won' && winner.winner ? (
                                    <>{winner.winner} 🏆</>
                                ) : (
                                    'Disponível'
                                )}
                            </span>
                        </div>
                    ))}
                </div>

                {winners.length > 5 && (
                    <button
                        className="show-more-btn"
                        onClick={() => setShowAllWinners(!showAllWinners)}
                    >
                        <ChevronDown
                            size={20}
                            style={{
                                transform: showAllWinners ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s'
                            }}
                        />
                        {showAllWinners ? 'Mostrar Menos' : 'Mostrar Mais'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstantRaffles;
