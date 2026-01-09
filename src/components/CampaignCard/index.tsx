/**
 * Componente Campaign Card
 * View Layer - MVC Pattern
 */

import { useNavigate } from 'react-router-dom';
import type { Campaign } from '../../models/types';

interface CampaignCardProps {
    campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/campanha/${campaign.id}`);
    };

    return (
        <div className="campaign-card" onClick={handleClick} style={{ cursor: 'pointer' }}>

            {/* Imagem da Campanha */}
            <div className="campaign-image-wrapper">
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="campaign-image"
                />
                {campaign.status === 'active' && <div className="status-badge" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>Adquira Já!</div>}
            </div>

            {/* Conteúdo da Campanha */}
            <div className="campaign-content">
                <h3 className="campaign-title">{campaign.title}</h3>
                <p className="campaign-subtitle">Participe e concorra!</p>

                <button className="campaign-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}>Adquira Já!</button>
            </div>
        </div>
    );
};

export default CampaignCard;
