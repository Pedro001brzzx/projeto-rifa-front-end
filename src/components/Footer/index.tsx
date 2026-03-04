/**
 * Componente Footer
 * View Layer - MVC Pattern
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../context/AuthContext';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuthContext();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Links do Footer */}
                    <div className="footer-links">
                        <button className="footer-link" onClick={() => navigate('/termos-de-uso')}>Termos de uso</button>
                        <span className="footer-separator">•</span>
                        <button className="footer-link" onClick={() => navigate('/politica-de-privacidade')}>Política de privacidade</button>
                        <span className="footer-separator">•</span>
                        <button className="footer-link" onClick={() => navigate('/politica-de-cookies')}>Política de cookies</button>
                        <span className="footer-separator">•</span>
                        <button className="footer-link" onClick={() => navigate('/ganhadores')}>Ganhadores</button>
                        {isAdmin && (
                            <>
                                <span className="footer-separator">•</span>
                                <button className="footer-link" onClick={() => navigate('/painel-secreto-x9')}>Admin</button>
                            </>
                        )}
                    </div>

                    {/* Copyright */}
                    <p className="footer-copyright">
                        2025 - Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
