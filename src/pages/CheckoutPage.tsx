/**
 * Checkout Page
 * Displays PIX payment details with countdown timer
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import CheckoutTimer from '../components/CheckoutTimer';
import { useAuthContext } from '../context/AuthContext';
import { paymentService } from '../services/paymentService';
import type { StatusPagamento } from '../types/api.types';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
    const { compraId } = useParams<{ compraId: string }>();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<StatusPagamento | null>(null);
    // const [qrCodeImage, setQrCodeImage] = useState<string>('');
    const [pixCode, setPixCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expired, setExpired] = useState(false);
    const [copied, setCopied] = useState(false);

    const {
        user,
        cpf,
        password,
        isLoading: authLoading,
        error: authError,
        setCpf,
        setPassword,
        handleLogin
    } = useAuthContext();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        if (!compraId) {
            setError('ID da compra não encontrado');
            setIsLoading(false);
            return;
        }

        loadPaymentStatus();

        // Monitorar status a cada 5 segundos
        const interval = setInterval(loadPaymentStatus, 5000);

        return () => clearInterval(interval);
    }, [user, compraId, navigate]);

    const loadPaymentStatus = async () => {
        if (!compraId) return;

        try {
            setIsLoading(true);
            const response = await paymentService.consultarPagamento(parseInt(compraId));
            setPaymentStatus(response.data);

            // DEBUG: Verificar dados recebidos
            console.log('📊 Payment Status:', response.data);
            console.log('⏱️ Expira Em:', response.data.expira_em);
            console.log('✅ Has Expira Em?', !!response.data.expira_em);

            // REGRA 1: Se aprovado, redirecionar para MyTickets
            if (response.data.status_pagamento === 'aprovado') {
                console.log('✅ Pagamento aprovado! Redirecionando para MyTickets em 2s...');
                setTimeout(() => {
                    navigate('/meus-titulos');
                }, 2000);
                return;
            }

            // REGRA 2: Se compra pendente tem mais de 2 minutos, redirecionar para MyTickets
            // (usuário voltou a URL antiga, deve acompanhar pelo painel)
            if (response.data.status_pagamento === 'pendente' && response.data.criado_em) {
                const criadoEm = new Date(response.data.criado_em);
                const agora = new Date();
                const idadeEmMinutos = (agora.getTime() - criadoEm.getTime()) / (1000 * 60);

                if (idadeEmMinutos > 2) {
                    console.log(`⏰ Compra pendente com ${idadeEmMinutos.toFixed(1)} minutos. Redirecionando para MyTickets...`);
                    navigate('/meus-titulos');
                    return;
                }

                console.log(`🆕 Compra recente (${idadeEmMinutos.toFixed(1)} min). Mostrando checkout normal.`);
            }

            // TODO: Buscar QR Code e PIX code do backend
            // Por enquanto, usando mock
            // setQrCodeImage('/placeholder-qr.png');
            setPixCode('00020126580014br.gov.bcb.pix0136...');

        } catch (err) {
            console.error('Erro ao carregar status do pagamento:', err);
            setError('Não foi possível carregar os dados do pagamento');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExpired = () => {
        setExpired(true);
        setTimeout(() => {
            navigate('/');
        }, 5000);
    };

    const handleCopyPixCode = async () => {
        try {
            await navigator.clipboard.writeText(pixCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Erro ao copiar código PIX:', err);
        }
    };

    // const formatCurrency = (value: number): string => {
    //     return value.toLocaleString('pt-BR', {
    //         style: 'currency',
    //         currency: 'BRL'
    //     });
    // };

    return (
        <div className="checkout-page">
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
                cpf={cpf ?? ''}
                password={password ?? ''}
                onCpfChange={setCpf ?? (() => { })}
                onPasswordChange={setPassword ?? (() => { })}
                onLogin={handleLogin ?? (() => Promise.resolve())}
                isLoading={authLoading ?? false}
                error={authError ?? null}
            />

            <main className="checkout-main">
                <div className="checkout-container">
                    {isLoading ? (
                        <div className="checkout-loading">
                            <Loader className="spinner" size={48} />
                            <p>Carregando dados do pagamento...</p>
                        </div>
                    ) : error ? (
                        <div className="checkout-error">
                            <AlertTriangle size={48} />
                            <h2>Erro ao carregar pagamento</h2>
                            <p>{error}</p>
                            <button onClick={() => navigate('/')}>
                                Voltar para Campanhas
                            </button>
                        </div>
                    ) : expired ? (
                        <div className="checkout-expired">
                            <AlertTriangle size={72} className="expired-icon" />
                            <h1>Tempo Expirado</h1>
                            <p>O prazo para pagamento se esgotou.</p>
                            <p className="expired-info">
                                Os títulos reservados foram liberados e estão disponíveis novamente.
                            </p>
                            <button onClick={() => navigate('/')}>
                                Voltar para Campanhas
                            </button>
                        </div>
                    ) : paymentStatus?.status_pagamento === 'aprovado' ? (
                        <div className="checkout-success">
                            <CheckCircle size={72} className="success-icon" />
                            <h1>Pagamento Confirmado!</h1>
                            <p>Seu pagamento foi aprovado com sucesso.</p>
                            <p className="success-info">
                                Redirecionando para seus títulos...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="checkout-header">
                                <div className="hourglass-icon">⏳</div>
                                <div className="checkout-header-text">
                                    <h1>Aguardando pagamento!</h1>
                                    <p>Realize o pagamento</p>
                                </div>
                            </div>

                            {/* Timer com fallback para compras antigas */}
                            {(() => {
                                // Se tem expira_em, usar diretamente
                                if (paymentStatus?.expira_em) {
                                    console.log('✅ Usando expira_em da API:', paymentStatus.expira_em);
                                    return (
                                        <CheckoutTimer
                                            expiresAt={paymentStatus.expira_em}
                                            onExpired={handleExpired}
                                        />
                                    );
                                }

                                // Fallback: Calcular expira_em a partir de criado_em + 10 minutos
                                // (apenas para compras antigas sem expira_em)
                                if (paymentStatus?.criado_em && paymentStatus.status_pagamento === 'pendente') {
                                    const criadoEm = new Date(paymentStatus.criado_em);
                                    const expiraEm = new Date(criadoEm.getTime() + 10 * 60 * 1000); // +10 minutos
                                    const agora = new Date();

                                    // IMPORTANTE: Se já expirou (criada há mais de 10 min), não renderizar timer
                                    if (expiraEm <= agora) {
                                        console.log('❌ Compra antiga já expirou! Expirando imediatamente.');
                                        // Expirar após próximo render para evitar loop
                                        setTimeout(() => handleExpired(), 100);
                                        return null;
                                    }

                                    const expiraEmISO = expiraEm.toISOString();
                                    console.log('⚠️ Compra antiga válida! Expira em:', expiraEmISO);

                                    return (
                                        <CheckoutTimer
                                            expiresAt={expiraEmISO}
                                            onExpired={handleExpired}
                                        />
                                    );
                                }

                                console.log('❌ Não foi possível renderizar timer');
                                return null;
                            })()}

                            <div className="payment-instructions">
                                <div className="instruction-step">
                                    <div className="step-number">1</div>
                                    <p>Copie o código PIX abaixo.</p>
                                </div>

                                <div className="pix-code-container">
                                    <input
                                        type="text"
                                        value={pixCode}
                                        readOnly
                                        className="pix-code-input"
                                    />
                                    <button
                                        onClick={handleCopyPixCode}
                                        className={`copy-button ${copied ? 'copied' : ''}`}
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle size={18} />
                                                COPIADO
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} />
                                                COPIAR
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="instruction-step">
                                    <div className="step-number">2</div>
                                    <p>Abra o app do seu banco e escolha a opção PIX, como se fosse fazer uma transferência.</p>
                                </div>

                                <div className="instruction-step">
                                    <div className="step-number">3</div>
                                    <p>Selecione a opção PIX cópia e cola, cole a chave copiada e confirme o pagamento.</p>
                                </div>

                                <button className="qr-code-toggle" onClick={() => { }}>
                                    Mostrar QR Code
                                </button>
                            </div>

                            <div className="payment-warning">
                                <AlertTriangle size={20} />
                                <p>
                                    Este pagamento só pode ser realizado dentro do tempo. Após este período,
                                    caso o pagamento não seja confirmado, os títulos voltam a ficar disponíveis.
                                </p>
                            </div>

                            <div className="campaign-info">
                                {paymentStatus?.campanha && (
                                    <>
                                        <img
                                            src={paymentStatus.campanha.imagem_principal || '/placeholder-campaign.jpg'}
                                            alt={paymentStatus.campanha.titulo}
                                            className="campaign-image"
                                        />
                                        <div className="campaign-details">
                                            <h3>{paymentStatus.campanha.titulo}</h3>
                                            <p>
                                                {paymentStatus.quantidade_titulos} {paymentStatus.quantidade_titulos === 1 ? 'título' : 'títulos'} - {' '}
                                                R$ {paymentStatus.valor_total.toFixed(2).replace('.', ',')}
                                            </p>
                                            <button className="status-badge">Participando da sorte!</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main >

            <Footer />
        </div >
    );
};

export default CheckoutPage;
