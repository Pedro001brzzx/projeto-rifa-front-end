/**
 * Componente Campaigns List
 * View Layer - MVC Pattern
 */

import React from 'react';
import type { Campaign } from '../../models/types';
import CampaignCardFeatured from '../CampaignCardFeatured';
import CampaignCardCompact from '../CampaignCardCompact';

interface CampaignsListProps {
    campaigns: Campaign[];
}

const CampaignsList: React.FC<CampaignsListProps> = ({ campaigns }) => {
    if (campaigns.length === 0) return null;

    const [featuredCampaign, ...otherCampaigns] = campaigns;

    return (
        <div className="campaigns-section" id="campanhas">
            <div className="campaigns-container">
                {/* Campanha em Destaque */}
                {featuredCampaign && (
                    <div className="campaigns-featured">
                        <CampaignCardFeatured campaign={featuredCampaign} />
                    </div>
                )}

                {/* Lista de Campanhas Compactas */}
                {otherCampaigns.length > 0 && (
                    <div className="campaigns-compact-list">
                        {otherCampaigns.map((campaign) => (
                            <CampaignCardCompact key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignsList;
