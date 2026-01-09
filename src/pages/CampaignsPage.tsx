/**
 * Campaigns Page Component
 * Página dedicada apenas para listagem de campanhas
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Models
import { campaigns } from '../models/data';

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

    // Handler para login que também fecha o modal
    const handleLoginSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <>
            {/* Modal de Login */}
            <LoginModal
                isOpen={loginModalOpen}
                onClose={closeLoginModal}
                cpf={cpf}
                password={password}
                onCpfChange={setCpf}
                onPasswordChange={setPassword}
                onLogin={handleLoginSubmit}
                isLoading={authLoading}
                error={authError}
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

            {/* Main Content - Apenas Campanhas */}
            <main>
                <CampaignsList campaigns={campaigns} />
            </main>

            {/* Rodapé */}
            <Footer />
        </>
    );
};

export default CampaignsPage;
