/**
 * Contact Page
 * Contact form for users to communicate with administration
 */

import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import { useAuthContext } from '../context/AuthContext';
import './ContactPage.css';

const ContactPage: React.FC = () => {
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

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            // Reset form
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="contact-page">
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
                cpf={cpf}
                password={password}
                onCpfChange={setCpf}
                onPasswordChange={setPassword}
                onLogin={handleLogin}
                isLoading={authLoading}
                error={authError}
            />

            <main className="contact-main">
                <div className="container">
                    <div className="contact-content">
                        <div className="contact-header">
                            <MessageSquare size={24} className="contact-icon" />
                            <h1>Contato</h1>
                            <p className="contact-subtitle">Tire suas dúvidas</p>
                        </div>

                        <div className="contact-body">
                            <p className="contact-intro">
                                Sinta-se livre para nos contatar.<br />
                                Ficaremos felizes em ouvir de você.
                            </p>

                            {submitSuccess && (
                                <div className="contact-success">
                                    ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nome*"
                                        className="contact-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="E-mail*"
                                        className="contact-input"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <PhoneInput
                                        country={'br'}
                                        value={phone}
                                        onChange={setPhone}
                                        containerClass="phone-input-container"
                                        inputClass="contact-input"
                                        buttonClass="phone-dropdown-button"
                                        enableSearch={true}
                                        searchPlaceholder="Buscar país..."
                                        placeholder="Telefone*"
                                    />
                                </div>

                                <div className="form-group">
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="contact-select"
                                        required
                                    >
                                        <option value="">Selecione um assunto*</option>
                                        <option value="suporte">Suporte</option>
                                        <option value="vendas">Vendas</option>
                                        <option value="geral">Geral</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="parceria">Parceria</option>
                                        <option value="reclamacao">Reclamação</option>
                                        <option value="sugestao">Sugestão</option>
                                        <option value="duvida">Dúvida</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Digite sua mensagem aqui.*"
                                        className="contact-textarea"
                                        rows={6}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="contact-submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                                    {!isSubmitting && <Send size={18} />}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
