/**
 * Componente Hero Section
 * View Layer - MVC Pattern
 */

import React from 'react';
import { Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
    return (
        <div className="hero-section" id="inicio">
            <div className="hero-header">
                <Zap className="hero-icon" size={24} />
                <div className="hero-text">
                    <h1 className="hero-title">Campanhas</h1>
                    <p className="hero-subtitle-small">Escolha sua sorte</p>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
