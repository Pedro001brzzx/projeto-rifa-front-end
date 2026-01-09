/**
 * Componente Header
 * View Layer - MVC Pattern
 */

import React from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';

interface HeaderProps {
    onLoginClick: () => void;
    onMenuToggle: () => void;
    isMobileMenuOpen: boolean;
    isAdmin?: boolean;
    onAdminClick?: () => void;
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    onMenuToggle,
    isMobileMenuOpen
}) => {
    return (
        <header className="header">
            <div className="header-content">
                {/* Logo */}
                <div className="header-left">
                    <img
                        src={logo}
                        alt="Gêmeos Brasil"
                        className="logo"
                    />
                </div>

                {/* Menu Hambúrguer */}
                <button
                    onClick={onMenuToggle}
                    className="menu-toggle"
                    aria-label="Menu"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
