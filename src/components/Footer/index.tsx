/**
 * Componente Footer
 * View Layer - MVC Pattern
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">

                    {/* Logo da Capitalizadora */}
                    <img
                        src="https://incs-bucket.s3.amazonaws.com/entidades/lotep.png"
                        alt="Capitalizadora"
                        className="footer-logo"
                    />

                    {/* Texto Legal */}
                    <p className="footer-text">
                        Este bilhete de loteria está autorizado com base no termo de autorização descrito no regulamento da promoção.
                        Antes de contratar, consulte o Regulamento do produto. É proibida a venda para menores de 18 anos.
                        Os sorteios e entrega dos prêmios serão realizados de acordo com os critérios estabelecidos neste site.
                    </p>

                    {/* Links do Footer */}
                    <div className="footer-links">
                        <button className="footer-link" onClick={() => navigate('/termos-de-uso')}>Termos de uso</button>
                        <span className="footer-separator">•</span>
                        <button className="footer-link">Política de privacidade</button>
                        <span className="footer-separator">•</span>
                        <button className="footer-link">Política de cookies</button>
                        <span className="footer-separator">•</span>
                        <button className="footer-link" onClick={() => navigate('/ganhadores')}>Ganhadores</button>
                    </div>

                    {/* Copyright */}
                    <p className="footer-copyright">
                        2025 Gêmeos Brasil© - Todos os direitos reservados.
                    </p>

                    {/* Hidden Admin Access */}
                    <button
                        className="admin-access-hidden"
                        onClick={() => navigate('/admin')}
                        title="Painel Administrativo"
                    >
                        admin only
                    </button>

                    {/* Botão de App */}
                    <button className="btn btn-app">
                        <span>📱 Instale o nosso APP Grátis</span>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
