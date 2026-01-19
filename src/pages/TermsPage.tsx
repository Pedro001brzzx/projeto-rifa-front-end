/**
 * Terms of Use Page
 * Displays terms and conditions
 */

import React from 'react';
import { FileText } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import { useAuthContext } from '../context/AuthContext';
import { useState } from 'react';
import './TermsPage.css';

const TermsPage: React.FC = () => {
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
                            <FileText size={24} className="terms-icon" />
                            <h1>Termos de Uso</h1>
                        </div>

                        <div className="terms-body">
                            <p className="terms-intro">
                                "Na qualidade de Subscritor, aprovado conforme o processo que consta no documento:
                            </p>

                            <div className="terms-item">
                                <p>
                                    (i) Tenho conhecimento de que a contratação implica na automática adesão a todos os termos das Condições Gerais e do regulamento, os quais estão disponíveis para <a href="#" className="terms-link">minha consulta</a>.
                                </p>
                            </div>

                            <div className="terms-item">
                                <p>
                                    (ii) O contemplado poderá autorizar, de forma gratuita, o direito de uso de seu nome, imagem e voz, pelo período de um ano, para fins de divulgação da campanha.
                                </p>
                            </div>

                            <div className="terms-item">
                                <p>
                                    (iii) Concordo com os Termos de Uso e a <a href="#" className="terms-link">Política de Privacidade</a>."
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>1. Aceitação dos Termos</h2>
                                <p>
                                    Ao acessar e usar este serviço, você aceita e concorda em ficar vinculado aos termos e condições deste acordo.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>2. Uso do Serviço</h2>
                                <p>
                                    Este serviço é fornecido apenas para uso pessoal e não comercial. Você concorda em não usar o serviço para qualquer finalidade ilegal ou não autorizada.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>3. Propriedade Intelectual</h2>
                                <p>
                                    Todo o conteúdo incluído no serviço, como texto, gráficos, logotipos, imagens, é propriedade da empresa e está protegido pelas leis de direitos autorais.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>4. Limitação de Responsabilidade</h2>
                                <p>
                                    A empresa não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou incapacidade de usar o serviço.
                                </p>
                            </div>

                            <div className="terms-section">
                                <h2>5. Modificações</h2>
                                <p>
                                    Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações entrarão em vigor imediatamente após a publicação.
                                </p>
                            </div>

                            <div className="terms-footer-note">
                                <p>Última atualização: Janeiro de 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsPage;
