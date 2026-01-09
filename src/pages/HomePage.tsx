/**
 * Home Page Component
 * Main public-facing page with campaigns
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Models
import { campaigns, faqs } from '../models/data';
import { winners } from '../models/winners';

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
        <div className="app-container">
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

            {/* Seção Hero */}
            <HeroSection />

            {/* Lista de Campanhas */}
            <CampaignsList campaigns={campaigns} />

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
