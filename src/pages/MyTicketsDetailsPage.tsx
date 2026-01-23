/**
 * My Tickets Details Page
 * Displays detailed information about a specific purchase including ticket numbers
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import { useAuthContext } from '../context/AuthContext';
import { compraService } from '../services/purchaseService';
import type { Compra, Titulo, Campanha } from '../types/api.types';
import './MyTicketsDetailsPage.css';

interface PurchaseDetails extends Compra {
    campanha?: Campanha;
    titulos: Titulo[];
    criado_em: string;
    status_pagamento?: 'pendente' | 'aprovado' | 'cancelado' | 'recusado' | 'expirado';
    expira_em?: string;
}

const MyTicketsDetailsPage: React.FC = () => {
    const { compraId } = useParams<{ compraId: string }>();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        const fetchPurchaseDetails = async () => {
            // Redirect if not authenticated
            if (!user) {
                setIsLoading(false);
                navigate('/meus-titulos');
                return;
            }

            if (!compraId) {
                setError('ID da compra não encontrado');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Fetch user's tickets to find the specific purchase
                const response = await compraService.meusTitulos();

                // Find the specific purchase by ID
                const purchase = response.data.compras.find(
                    (compra: any) => compra.id === parseInt(compraId)
                );

                if (!purchase) {
                    setError('Compra não encontrada');
                    setIsLoading(false);
                    return;
                }

                setPurchaseDetails(purchase);
            } catch (err) {
                console.error('Error fetching purchase details:', err);
                setError('Não foi possível carregar os detalhes da compra. Tente novamente mais tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchaseDetails();
    }, [user, compraId, navigate]);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} às ${hours}:${minutes}`;
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const handleBack = () => {
        navigate('/meus-titulos');
    };

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            'pendente': 'Pendente',
            'pago': 'Pago',
            'cancelado': 'Expirado',
            'expired': 'Expirado'
        };
        return statusMap[status] || status;
    };

    const maskCPF = (cpf: string): string => {
        if (!cpf || cpf.length < 11) return '***.***.***-**';
        return `${cpf.slice(0, 3)}.***.***-${cpf.slice(-2)}`;
    };

    const maskPhone = (phone: string): string => {
        if (!phone) return '(85) 9****-****';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 10) return '(85) 9****-****';
        return `(${cleaned.slice(0, 2)}) 9****-****`;
    };

    return (
        <div className="my-tickets-details-page">
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

            <main className="details-main">
                <div className="details-container">
                    {/* Back Button */}
                    <button className="back-button" onClick={handleBack}>
                        <ArrowLeft size={20} />
                        Voltar
                    </button>

                    {isLoading ? (
                        <div className="details-loading">
                            <div className="loading-spinner"></div>
                            <p>Carregando detalhes...</p>
                        </div>
                    ) : error ? (
                        <div className="details-error">
                            <p className="error-message">{error}</p>
                            <button className="retry-button" onClick={() => window.location.reload()}>
                                Tentar Novamente
                            </button>
                        </div>
                    ) : purchaseDetails ? (
                        <>
                            {/* Status Alert */}
                            {purchaseDetails.status_pagamento !== 'aprovado' && (
                                <div className={`status-alert ${purchaseDetails.status_pagamento === 'expirado' || purchaseDetails.status_pagamento === 'cancelado'
                                    ? 'alert-error'
                                    : 'alert-warning'
                                    }`}>
                                    <div className="alert-icon">
                                        {purchaseDetails.status_pagamento === 'expirado' || purchaseDetails.status_pagamento === 'cancelado' ? '✕' : '⚠'}
                                    </div>
                                    <div className="alert-content">
                                        <strong>
                                            {purchaseDetails.status_pagamento === 'expirado' || purchaseDetails.status_pagamento === 'cancelado'
                                                ? 'Pagamento expirado!'
                                                : 'Pagamento pendente!'}
                                        </strong>
                                        <p>
                                            {purchaseDetails.status_pagamento === 'expirado' || purchaseDetails.status_pagamento === 'cancelado'
                                                ? 'Seu pagamento foi expirado. Os títulos foram liberados.'
                                                : 'Aguardando confirmação do pagamento.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Campaign Section */}
                            {purchaseDetails.campanha && (
                                <div className="campaign-section">
                                    <div className="campaign-header">
                                        <div className="campaign-image">
                                            <img
                                                src={purchaseDetails.campanha.imagem_principal}
                                                alt={purchaseDetails.campanha.titulo}
                                            />
                                        </div>
                                        <div className="campaign-info">
                                            <h2>{purchaseDetails.campanha.titulo}</h2>
                                            <span className="campaign-status-badge">
                                                {purchaseDetails.campanha.status === 'ativo' ? 'Campanha ativa' : 'Campanha encerrada'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="campaign-access-button"
                                        onClick={() => navigate(`/campanha/${purchaseDetails.campanha?.slug}`)}
                                    >
                                        Acessar esta rifa
                                    </button>
                                </div>
                            )}

                            {/* Purchase Details Card */}
                            <div className="purchase-details-card">
                                <div className="detail-row">
                                    <span className="detail-label">Detalhes da sua compra:</span>
                                    <span className="detail-value purchase-code">
                                        {String(purchaseDetails.id).padStart(7, '0')}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Comprador:</span>
                                    <span className="detail-value">{user?.nome || 'Não informado'}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">CPF:</span>
                                    <span className="detail-value">
                                        {maskCPF(user?.cpf || '')}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Telefone:</span>
                                    <span className="detail-value">
                                        {maskPhone(user?.telefone || '')}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Situação:</span>
                                    <span className={`detail-value status-${purchaseDetails.status}`}>
                                        {getStatusLabel(purchaseDetails.status)}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Data/horário:</span>
                                    <span className="detail-value">
                                        {formatDate(purchaseDetails.criado_em)}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Quantidade:</span>
                                    <span className="detail-value">{purchaseDetails.quantidade_titulos}</span>
                                </div>

                                <div className="detail-row highlight-row">
                                    <span className="detail-label">Total:</span>
                                    <span className="detail-value total-value">
                                        {formatCurrency(purchaseDetails.valor_total)}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Títulos:</span>
                                </div>
                            </div>

                            {/* Tickets Grid */}
                            {purchaseDetails.titulos && purchaseDetails.titulos.length > 0 && (
                                <div className="tickets-grid-section">
                                    <div className="tickets-grid">
                                        {purchaseDetails.titulos.map((titulo) => (
                                            <div key={titulo.id} className="ticket-number">
                                                {titulo.numero}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MyTicketsDetailsPage;
