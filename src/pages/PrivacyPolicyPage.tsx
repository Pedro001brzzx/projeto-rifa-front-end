/**
 * Privacy Policy Page
 * Displays privacy policy information
 */

import React from 'react';
import { Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';
import './TermsPage.css';

const PrivacyPolicyPage: React.FC = () => {
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
                            <Shield size={24} className="terms-icon" />
                            <h1>Política de Privacidade</h1>
                        </div>

                        <div className="terms-body">
                            <p className="terms-intro">
                                A sua privacidade é importante para nós. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.
                            </p>

                            <div className="terms-section">
                                <h2>1. Dados Coletados</h2>
                                <p>
                                    Coletamos os seguintes dados pessoais quando você se cadastra ou utiliza nossos serviços: nome completo, CPF, telefone, e-mail, endereço e dados de pagamento necessários para processar suas compras.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>2. Finalidade do Uso</h2>
                                <p>
                                    Seus dados pessoais são utilizados exclusivamente para: processamento de compras e pagamentos, comunicação sobre suas participações, envio de notificações sobre campanhas e resultados, cumprimento de obrigações legais e fiscais, e melhoria contínua de nossos serviços.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>3. Compartilhamento de Dados</h2>
                                <p>
                                    Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto quando necessário para processamento de pagamentos (gateways de pagamento), cumprimento de obrigações legais, ou quando autorizado expressamente por você.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>4. Segurança dos Dados</h2>
                                <p>
                                    Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia, controles de acesso e monitoramento contínuo.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>5. Seus Direitos (LGPD)</h2>
                                <p>
                                    Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acessar seus dados pessoais, solicitar correção de dados incompletos ou desatualizados, solicitar a exclusão de dados desnecessários, revogar seu consentimento a qualquer momento, e solicitar a portabilidade dos seus dados.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>6. Retenção de Dados</h2>
                                <p>
                                    Manteremos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados, ou conforme exigido por lei. Dados de transações financeiras são mantidos pelo prazo legal obrigatório.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>7. Contato</h2>
                                <p>
                                    Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco através da nossa página de Suporte ou envie um e-mail para o nosso canal de atendimento.
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

export default PrivacyPolicyPage;
