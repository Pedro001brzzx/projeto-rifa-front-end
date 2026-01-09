/**
 * Componente Menu Mobile
 * View Layer - MVC Pattern
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Bell, CreditCard, UserPlus, Trophy, FileText, Headphones, LogIn } from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    onLoginClick: () => void;
    onCloseMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onLoginClick, onCloseMenu }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const scrollToSection = (sectionId: string) => {
        // Verificar se estamos na página principal
        const isHomePage = window.location.pathname === '/';

        if (isHomePage) {
            // Se estamos na home, fazer scroll normalmente
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                onCloseMenu();
            }
        } else {
            // Se estamos em outra página, navegar para home primeiro
            navigate(`/#${sectionId}`);
            onCloseMenu();
            // Após navegação, fazer scroll
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

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
                    <button className="mobile-nav-item">
                        <CreditCard size={20} />
                        <span>Meus títulos</span>
                    </button>
                    <button className="mobile-nav-item mobile-nav-item-highlight" onClick={handleRegisterClick}>
                        <UserPlus size={20} />
                        <span>Cadastro</span>
                    </button>
                    <button className="mobile-nav-item">
                        <Trophy size={20} />
                        <span>Ganhadores</span>
                    </button>
                    <button className="mobile-nav-item">
                        <FileText size={20} />
                        <span>Termos de uso</span>
                    </button>
                    <button className="mobile-nav-item">
                        <Headphones size={20} />
                        <span>Suporte</span>
                    </button>

                    {/* Botão ENTRAR em Destaque */}
                    <button onClick={onLoginClick} className="mobile-menu-login-btn">
                        <LogIn size={20} />
                        Entrar
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default MobileMenu;
