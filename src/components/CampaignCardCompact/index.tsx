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
                <p className="campaign-compact-subtitle">*40.000,00 EM PRÊMIOS INSTANTÂNEOS</p>
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
                    Consultar
                </button>
                {campaign.date && (
                    <span className="campaign-compact-date">{campaign.date}</span>
                )}
            </div>
        </div>
    );
};

export default CampaignCardCompact;
