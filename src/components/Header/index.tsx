/**
 * Componente Header
 * View Layer - MVC Pattern
 */

import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
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
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Gêmeos Brasil"
                            className="logo"
                        />
                    </Link>
                </div>

                <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Menu Hambúrguer */}

                    {/* Menu Hambúrguer */}
                    <button
                        onClick={onMenuToggle}
                        className="menu-toggle"
                        aria-label="Menu"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
