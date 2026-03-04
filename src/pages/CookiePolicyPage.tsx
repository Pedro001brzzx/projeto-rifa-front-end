/**
 * Cookie Policy Page
 * Displays cookie usage policy
 */

import React from 'react';
import { Cookie } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';
import './TermsPage.css';

const CookiePolicyPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const {
        cpf,
        password,
        isLoading: authLoading,
        error: authError,
        setCpf,
        setPassword,
        handleLogin
    } = useAuthContext();

    return (
        <div className="terms-page">
            <Header
                onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                onLoginClick={() => setLoginModalOpen(true)}
                isMobileMenuOpen={mobileMenuOpen}
            />

            <MobileMenu
                isOpen={mobileMenuOpen}
                onCloseMenu={() => setMobileMenuOpen(false)}
                onLoginClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                }}
            />

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                cpf={cpf!}
                password={password!}
                onCpfChange={setCpf!}
                onPasswordChange={setPassword!}
                onLogin={handleLogin!}
                isLoading={authLoading}
                error={authError}
            />

            <main className="terms-main">
                <div className="container">
                    <div className="terms-content">
                        <div className="terms-header">
                            <Cookie size={24} className="terms-icon" />
                            <h1>Política de Cookies</h1>
                        </div>

                        <div className="terms-body">
                            <p className="terms-intro">
                                Este site utiliza cookies para melhorar sua experiência de navegação. Ao continuar utilizando nossos serviços, você concorda com o uso de cookies conforme descrito nesta política.
                            </p>

                            <div className="terms-section">
                                <h2>1. O que são Cookies?</h2>
                                <p>
                                    Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem que o site reconheça seu dispositivo e lembre suas preferências, melhorando sua experiência de navegação.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>2. Cookies Essenciais</h2>
                                <p>
                                    São necessários para o funcionamento básico do site. Incluem cookies de autenticação (login), sessão do usuário, e preferências de segurança. Sem esses cookies, o site não funcionaria corretamente.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>3. Cookies de Desempenho</h2>
                                <p>
                                    Coletam informações sobre como os visitantes utilizam o site, como quais páginas são mais visitadas e se há erros. Esses dados nos ajudam a melhorar o desempenho e a experiência geral do site.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>4. Cookies de Funcionalidade</h2>
                                <p>
                                    Permitem que o site lembre escolhas que você faz, como seu idioma preferido ou região, e forneçam recursos aprimorados e mais personalizados.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>5. Como Gerenciar Cookies</h2>
                                <p>
                                    Você pode controlar e/ou excluir cookies como desejar. A maioria dos navegadores permite que você bloqueie ou exclua cookies através das configurações. No entanto, a desativação de cookies essenciais pode afetar a funcionalidade do site.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>6. Consentimento</h2>
                                <p>
                                    Ao utilizar nosso site, você consente com o uso de cookies conforme descrito nesta política. Você pode retirar seu consentimento a qualquer momento, limpando os cookies do seu navegador.
                                </p>
                            </div>

                            <div className="terms-footer-note">
                                <p>Última atualização: Fevereiro de 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CookiePolicyPage;
