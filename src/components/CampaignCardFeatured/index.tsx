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
            </div>

            {/* Conteúdo */}
            <div className="campaign-featured-content">
                <h3 className="campaign-featured-title">{campaign.title}</h3>
                <p className="campaign-featured-subtitle">Participe e concorra!</p>

                <button
                    className="campaign-featured-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    Adquira Já!
                </button>
            </div>
        </div>
    );
};

export default CampaignCardFeatured;
