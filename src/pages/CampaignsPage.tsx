/**
 * Campaigns Page Component
 * Página dedicada apenas para listagem de campanhas
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Services
import { campanhaService } from '../services/campaignService';
import { mapCampanhasToFrontend } from '../utils/mappers';

// Types
import type { Campaign } from '../models/types';

// Controllers (Hooks)
import { useAuthContext } from '../context/AuthContext';
import { useUI } from '../hooks/useUI';

// Views (Components)
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import MobileMenu from '../components/MobileMenu';
import CampaignsList from '../components/CampaignsList';
import Footer from '../components/Footer';

const CampaignsPage: React.FC = () => {
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

    // Buscar campanhas na montagem do componente
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await campanhaService.listar({ page: 1, per_page: 50 });
                const allCampaigns = mapCampanhasToFrontend(response.data.campanhas);
                // Sort: active first, concluded after
                const sorted = allCampaigns.sort((a, b) => {
                    if (a.status === 'active' && b.status !== 'active') return -1;
                    if (a.status !== 'active' && b.status === 'active') return 1;
                    return 0;
                });
                setCampaigns(sorted);
            } catch (err) {
                console.error('Erro ao buscar campanhas:', err);
                setError('Não foi possível carregar as campanhas. Tente novamente mais tarde.');
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

            {/* Main Content - Campanhas */}
            <main className="main-content-wrapper">
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
                    <>
                        <div style={{ padding: '0 1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem' }}>
                                Todas as Campanhas
                            </h1>
                            <p style={{ color: '#64748b' }}>Escolha sua sorte</p>
                        </div>
                        <CampaignsList campaigns={campaigns} />
                    </>
                )}
            </main>

            {/* Rodapé */}
            <Footer />
        </div>
    );
};

export default CampaignsPage;
