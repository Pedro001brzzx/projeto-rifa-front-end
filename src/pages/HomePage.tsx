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
    const [winnersData, setWinnersData] = useState<any[]>([]);
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

    // Buscar campanhas da API e Ganhadores
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [campaignsResponse, winnersResponse] = await Promise.all([
                    campanhaService.listar({ page: 1, per_page: 50 }),
                    campanhaService.listarGanhadores(3) // Top 3 winners
                ]);

                const allCampaigns = mapCampanhasToFrontend(campaignsResponse.data.campanhas);
                // Sort: active first, concluded after
                const sorted = allCampaigns.sort((a, b) => {
                    if (a.status === 'active' && b.status !== 'active') return -1;
                    if (a.status !== 'active' && b.status === 'active') return 1;
                    return 0;
                });
                setCampaigns(sorted);
                setWinnersData(winnersResponse.data.ganhadores || []); // Set winners data
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
                setError('Não foi possível carregar os dados.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

            {/* Container Principal (Branco) */}
            <div className="main-content-wrapper">
                {/* Seção Hero (Título) */}
                <HeroSection />

                {/* Lista de Campanhas */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Carregando campanhas...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
                        >
                            Tentar Novamente
                        </button>
                    </div>
                ) : (
                    <CampaignsList campaigns={campaigns} />
                )}

                {/* Seção de Ganhadores — dentro do mesmo container */}
                <WinnersSection winners={winnersData} />
            </div>

            {/* FAQ */}
            <FAQSection faqs={faqs} />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
