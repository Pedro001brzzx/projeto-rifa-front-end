/**
 * Componente Campaign Card Compact
 * Card compacto para lista de campanhas
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Campaign } from '../../models/types';

interface CampaignCardCompactProps {
    campaign: Campaign;
}

const CampaignCardCompact: React.FC<CampaignCardCompactProps> = ({ campaign }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/campanha/${campaign.slug || campaign.id}`);
    };

    return (
        <div
            className="campaign-card-compact"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            {/* Thumbnail pequena */}
            <div className="campaign-compact-thumbnail">
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="campaign-compact-image"
                />
            </div>

            {/* Informações */}
            <div className="campaign-compact-info">
                <h4 className="campaign-compact-title">{campaign.title}</h4>
                {campaign.status === 'concluded' ? (
                    <span className="campaign-compact-badge badge-concluido">Rifa Realizada</span>
                ) : campaign.status === 'active' && (campaign.soldPercentage || 0) >= 70 ? (
                    <span className="campaign-compact-badge badge-urgente">🔥 Últimas unidades!</span>
                ) : (
                    <span className="campaign-compact-badge badge-disponivel">✅ Disponível</span>
                )}
                {campaign.status === 'concluded' && campaign.conclusionDate && (
                    <span className="campaign-compact-date">📅 {campaign.conclusionDate}</span>
                )}
            </div>

            {/* Botão consultar */}
            <div className="campaign-compact-actions">
                <button
                    className="campaign-compact-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    {campaign.status === 'concluded' ? 'Ver Resultado' : 'Consultar'}
                </button>
            </div>
        </div>
    );
};

export default CampaignCardCompact;
