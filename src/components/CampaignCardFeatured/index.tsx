/**
 * Componente Campaign Card Featured
 * Card grande de destaque para campanha principal
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Campaign } from '../../models/types';

interface CampaignCardFeaturedProps {
    campaign: Campaign;
}

const CampaignCardFeatured: React.FC<CampaignCardFeaturedProps> = ({ campaign }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/campanha/${campaign.slug || campaign.id}`);
    };

    return (
        <div
            className="campaign-card-featured"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            {/* Imagem grande de destaque */}
            <div className="campaign-featured-image-wrapper">
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="campaign-featured-image"
                />

                {/* Concluded Badge */}
                {campaign.status === 'concluded' && (
                    <div className="concluded-badge">
                        Rifa Realizada
                    </div>
                )}

                {/* Warning Badge - Últimas unidades */}
                {campaign.status === 'active' && (campaign.soldPercentage || 0) >= 70 && (
                    <div className="warning-badge">
                        🔥 Últimas unidades!
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            <div className="campaign-featured-content">
                <h3 className="campaign-featured-title">{campaign.title}</h3>
                {campaign.status === 'concluded' ? (
                    <>
                        <p className="campaign-featured-subtitle" style={{ color: '#3b82f6' }}>Rifa Realizada</p>
                        {campaign.conclusionDate && (
                            <p className="campaign-featured-date">📅 {campaign.conclusionDate}</p>
                        )}
                    </>
                ) : (
                    <p className="campaign-featured-subtitle">Participe e concorra!</p>
                )}

                <button
                    className="campaign-featured-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    {campaign.status === 'concluded' ? 'Ver Resultado' : 'Adquira Já!'}
                </button>
            </div>
        </div>
    );
};

export default CampaignCardFeatured;
