/**
 * Home Page Component
 * Main public-facing page with campaigns
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Services
import { campanhaService } from '../services/campaignService';
import { mapCampanhasToFrontend } from '../utils/mappers';

// Models
import { faqs } from '../models/data';
import { winners } from '../models/winners';

// Types
import type { Campaign } from '../models/types';

// Controllers (Hooks)
import { useAuthContext } from '../context/AuthContext';
import { useUI } from '../hooks/useUI';

// Views (Components)
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import MobileMenu from '../components/MobileMenu';
import HeroSection from '../components/HeroSection';
import WinnersSection from '../components/WinnersSection';
import CampaignsList from '../components/CampaignsList';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        cpf,
        password,
        isAdmin,
        isLoading: authLoading,
        error: authError,
        setCpf,
        setPassword,
        handleLogin,
        handleLogout
    } = useAuthContext();

    const {
        mobileMenuOpen,
        loginModalOpen,
        toggleMobileMenu,
        openLoginModal,
        closeLoginModal
    } = useUI();

    // Buscar campanhas da API
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await campanhaService.listarAtivas();
                const frontendCampaigns = mapCampanhasToFrontend(response.data.campanhas);

                setCampaigns(frontendCampaigns);
            } catch (err) {
                console.error('Erro ao buscar campanhas:', err);
                setError('Não foi possível carregar as campanhas.');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    // Handler para login que também fecha o modal
    const handleLoginSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!handleLogin) return;
        try {
            await handleLogin(e);
            closeLoginModal();
        } catch (err) {
            // Error is handled by useAuth
        }
    };

    const handleAdminClick = () => {
        navigate('/admin');
    };

    return (
        <div className="app-container">
            {/* Modal de Login */}
            <LoginModal
                isOpen={loginModalOpen}
                onClose={closeLoginModal}
                cpf={cpf ?? ''}
                password={password ?? ''}
                onCpfChange={setCpf ?? (() => { })}
                onPasswordChange={setPassword ?? (() => { })}
                onLogin={handleLoginSubmit}
                isLoading={authLoading ?? false}
                error={authError ?? null}
            />

            {/* Header com Menu Mobile */}
            <Header
                onLoginClick={openLoginModal}
                onMenuToggle={toggleMobileMenu}
                isMobileMenuOpen={mobileMenuOpen}
                isAdmin={isAdmin}
                onAdminClick={handleAdminClick}
                onLogout={handleLogout}
            />

            <MobileMenu isOpen={mobileMenuOpen} onLoginClick={openLoginModal} onCloseMenu={toggleMobileMenu} />

            {/* Seção Hero */}
            <HeroSection />

            {/* Lista de Campanhas */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Carregando campanhas...</p>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                    <p>{error}</p>
                </div>
            ) : (
                <CampaignsList campaigns={campaigns} />
            )}

            {/* Seção de Ganhadores */}
            <WinnersSection winners={winners} />

            {/* FAQ */}
            <FAQSection faqs={faqs} />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
