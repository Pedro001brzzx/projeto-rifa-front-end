/**
 * Componente Menu Mobile
 * View Layer - MVC Pattern
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Bell, CreditCard, UserPlus, Trophy, FileText, Headphones, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileMenuProps {
    isOpen: boolean;
    onLoginClick: () => void;
    onCloseMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onLoginClick, onCloseMenu }) => {
    const navigate = useNavigate();
    const { user, logout: handleLogout } = useAuth();

    if (!isOpen) return null;



    const handleRegisterClick = () => {
        navigate('/register');
        onCloseMenu();
    };

    const handleHomeClick = () => {
        navigate('/');
        onCloseMenu();
    };

    const handleCampaignsClick = () => {
        navigate('/campanhas');
        onCloseMenu();
    };

    const handleTermsClick = () => {
        navigate('/termos-de-uso');
        onCloseMenu();
    };

    const handleContactClick = () => {
        navigate('/contato');
        onCloseMenu();
    };

    const handleWinnersClick = () => {
        navigate('/ganhadores');
        onCloseMenu();
    };

    const handleMyTicketsClick = () => {
        navigate('/meus-titulos');
        onCloseMenu();
    };

    const handleProfileClick = () => {
        navigate('/perfil');
        onCloseMenu();
    };

    const handleLogoutClick = async () => {
        await handleLogout();
        onCloseMenu();
        navigate('/');
    };

    return (
        <div className="mobile-menu">
            <div className="container">
                <nav className="mobile-nav">
                    <button className="mobile-nav-item" onClick={handleHomeClick}>
                        <Home size={20} />
                        <span>Início</span>
                    </button>
                    <button className="mobile-nav-item" onClick={handleCampaignsClick}>
                        <LayoutGrid size={20} />
                        <span>Campanhas</span>
                    </button>
                    <button className="mobile-nav-item">
                        <Bell size={20} />
                        <span>Comunicados</span>
                    </button>
                    <button className="mobile-nav-item" onClick={handleMyTicketsClick}>
                        <CreditCard size={20} />
                        <span>Meus títulos</span>
                    </button>
                    {user ? (
                        <button className="mobile-nav-item mobile-nav-item-highlight" onClick={handleProfileClick}>
                            <CreditCard size={20} />
                            <span>Meu Perfil</span>
                        </button>
                    ) : (
                        <button className="mobile-nav-item mobile-nav-item-highlight" onClick={handleRegisterClick}>
                            <UserPlus size={20} />
                            <span>Cadastro</span>
                        </button>
                    )}
                    <button className="mobile-nav-item" onClick={handleWinnersClick}>
                        <Trophy size={20} />
                        <span>Ganhadores</span>
                    </button>
                    <button className="mobile-nav-item" onClick={handleTermsClick}>
                        <FileText size={20} />
                        <span>Termos de uso</span>
                    </button>
                    <button className="mobile-nav-item" onClick={handleContactClick}>
                        <Headphones size={20} />
                        <span>Suporte</span>
                    </button>

                    {/* Conditional Login/Logout Button */}
                    {user ? (
                        <button onClick={handleLogoutClick} className="mobile-menu-logout-btn">
                            <LogOut size={20} />
                            Sair ({user.nome})
                        </button>
                    ) : (
                        <button onClick={onLoginClick} className="mobile-menu-login-btn">
                            <LogIn size={20} />
                            Entrar
                        </button>
                    )}
                </nav>
            </div>
        </div>
    );
};

export default MobileMenu;
