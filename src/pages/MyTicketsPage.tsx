/**
 * My Tickets Page
 * Displays user's purchased raffle tickets organized by campaign
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ChevronRight } from 'lucide-react';
import PurchaseTimer from '../components/PurchaseTimer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import { useAuthContext } from '../context/AuthContext';
import { compraService } from '../services/purchaseService';
import type { Purchase } from '../models/types';
import './MyTicketsPage.css';

const MyTicketsPage: React.FC = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

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

    const fetchPurchases = async (pageToFetch: number, resetArgs = false) => {
        if (!user) return;

        try {
            if (pageToFetch === 1) setIsLoading(true);
            else setIsLoadingMore(true);

            setError(null);

            const response = await compraService.meusTitulos({ page: pageToFetch, per_page: 20 });

            const totalPages = response.data.paginas;
            const currentPage = response.data.pagina_atual;

            // Check if there are more pages
            setHasMore(currentPage < totalPages);

            const newPurchases: Purchase[] = response.data.compras.map((compra: any) => ({
                id: compra.id,
                campaignId: compra.campanha?.id || compra.campanha_id,
                userId: compra.usuario_id,
                quantity: compra.quantidade_titulos,
                totalAmount: compra.valor_total,
                purchaseDate: compra.criado_em,
                status_pagamento: compra.status_pagamento,
                expira_em: compra.expira_em,
                campaign: compra.campanha ? {
                    id: compra.campanha.id,
                    title: compra.campanha.titulo,
                    subtitle: compra.campanha.descricao || '',
                    image: compra.campanha.imagem_principal,
                    status: compra.campanha.status === 'ativo' ? 'active' : 'concluded',
                    price: compra.campanha.valor_titulo,
                    totalTickets: compra.campanha.total_titulos || 0,
                    soldTickets: compra.campanha.titulos_vendidos || 0
                } : undefined,
                titulos: compra.titulos ? compra.titulos.map((t: any) => ({
                    id: t.id,
                    numero: t.numero,
                    is_ganhador: t.is_ganhador
                })) : []
            }));

            if (resetArgs || pageToFetch === 1) {
                setPurchases(newPurchases);
            } else {
                setPurchases(prev => [...prev, ...newPurchases]);
            }
        } catch (err) {
            console.error('Error fetching purchases:', err);
            setError('Não foi possível carregar seus títulos. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        if (user) {
            // Reset pagination when user changes or component mounts
            setPage(1);
            fetchPurchases(1, true);
        }
    }, [user]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPurchases(nextPage);
    };

    const filteredPurchases = purchases.filter(purchase => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();

        // Search by title
        if (purchase.campaign?.title.toLowerCase().includes(term)) return true;

        // Search by purchase ID
        if (String(purchase.id).includes(term)) return true;

        // Search by ticket numbers
        if (purchase.titulos?.some(t => t.numero.includes(term))) return true;

        return false;
    });

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



    const handlePurchaseClick = (purchaseId: string) => {
        navigate(`/meus-titulos/${purchaseId}`);
    };

    const getStatusBadge = (purchase: Purchase) => {
        // 1. Aprovado
        if (purchase.status_pagamento === 'aprovado') {
            return {
                text: 'COMPRA APROVADA',
                className: 'status-aprovado'
            };
        }

        // 2. Expirado (backend marcou como expirado)
        if (purchase.status_pagamento === 'expirado') {
            return {
                text: 'COMPRA NÃO REALIZADA',
                className: 'status-expirado'
            };
        }

        // 3. Pendente - verificar se expirou no frontend
        if (purchase.status_pagamento === 'pendente') {
            // Se tem expira_em, verificar se expirou
            if (purchase.expira_em) {
                const expiraEm = new Date(purchase.expira_em);
                const agora = new Date();

                if (expiraEm <= agora) {
                    return {
                        text: 'COMPRA NÃO REALIZADA',
                        className: 'status-expirado'
                    };
                }
            }

            // Pendente válido - mostrar com timer
            return {
                text: 'AGUARDANDO PAGAMENTO',
                className: 'status-pendente'
            };
        }

        // Fallback
        return {
            text: purchase.status_pagamento?.toUpperCase() || 'PROCESSANDO',
            className: 'status-default'
        };
    };

    return (
        <div className="my-tickets-page">
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

            <main className="my-tickets-main">
                <div className="my-tickets-container">
                    <div className="my-tickets-header-row">
                        <div className="my-tickets-header">
                            <Ticket size={24} className="my-tickets-icon" />
                            <h1>Meus títulos</h1>
                        </div>

                        {purchases.length > 0 && (
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Buscar"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <button className="search-button">
                                    Buscar
                                </button>
                            </div>
                        )}
                    </div>

                    {!user ? (
                        <div className="my-tickets-empty">
                            <Ticket size={48} className="empty-icon" />
                            <p className="empty-title">Faça login para ver seus títulos</p>
                            <p className="empty-description">
                                Entre na sua conta para visualizar todas as suas participações.
                            </p>
                            <button
                                className="empty-login-button"
                                onClick={() => setLoginModalOpen(true)}
                            >
                                Fazer Login
                            </button>
                        </div>
                    ) : isLoading ? (
                        <div className="my-tickets-loading">
                            <div className="loading-spinner"></div>
                            <p>Carregando seus títulos...</p>
                        </div>
                    ) : error ? (
                        <div className="my-tickets-error">
                            <p className="error-message">{error}</p>
                            <button
                                className="retry-button"
                                onClick={() => window.location.reload()}
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    ) : purchases.length === 0 ? (
                        <div className="my-tickets-empty">
                            <Ticket size={48} className="empty-icon" />
                            <p className="empty-title">Você ainda não possui títulos</p>
                            <p className="empty-description">
                                Participe de uma campanha para começar a concorrer aos prêmios!
                            </p>
                            <button
                                className="empty-campaigns-button"
                                onClick={() => navigate('/campanhas')}
                            >
                                Ver Campanhas
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="my-tickets-list">
                                {filteredPurchases.length === 0 ? (
                                    <div className="no-results">
                                        <p>Nenhum título encontrado com "{searchTerm}"</p>
                                    </div>
                                ) : (
                                    filteredPurchases.map((purchase) => (
                                        <div
                                            key={purchase.id}
                                            className="purchase-card-compact"
                                            onClick={() => handlePurchaseClick(purchase.id)}
                                        >
                                            <div className="purchase-card-header">
                                                <div className="purchase-date-compact">
                                                    {formatDate(purchase.purchaseDate)}
                                                </div>
                                            </div>

                                            <div className="purchase-content-row">
                                                <div className="purchase-image-compact">
                                                    <img
                                                        src={(purchase.campaign?.image && purchase.campaign.image.trim() !== '')
                                                            ? purchase.campaign.image
                                                            : '/placeholder.jpg'}
                                                        alt={purchase.campaign?.title || 'Campanha'}
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                </div>

                                                <div className="purchase-info-compact">
                                                    <h3 className="purchase-title-compact">
                                                        {purchase.campaign?.title || 'Campanha'}
                                                    </h3>

                                                    {(() => {
                                                        const badge = getStatusBadge(purchase);
                                                        return (
                                                            <div className="status-row">
                                                                <span className={`status-text ${badge.className}`}>
                                                                    {badge.text}
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Ticket Numbers - Visible on Card */}
                                                    {purchase.status_pagamento === 'aprovado' && purchase.titulos && purchase.titulos.length > 0 && (
                                                        <div className="ticket-numbers-preview">
                                                            {purchase.titulos.slice(0, 5).map(titulo => (
                                                                <span key={titulo.id} className="ticket-badge">
                                                                    {titulo.numero}
                                                                </span>
                                                            ))}
                                                            {purchase.titulos.length > 5 && (
                                                                <span className="ticket-badge-more">
                                                                    +{purchase.titulos.length - 5}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Pending with specific numbers if available but not approved yet ?? usually numbers are generated after approval. 
                                                        If backend logic changes to reserve numbers, handle here.
                                                        Currently most flows generate numbers after approval. 
                                                    */}
                                                </div>

                                                <div className="purchase-arrow-compact">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>

                                            {/* TIMER DE EXPIRAÇÃO */}
                                            {purchase.status_pagamento === 'pendente' && purchase.expira_em && (
                                                <div className="purchase-timer-compact">
                                                    <PurchaseTimer
                                                        expira_em={purchase.expira_em}
                                                        compact
                                                    />
                                                </div>
                                            )}

                                            {/* BOTÃO FINALIZAR PAGAMENTO */}
                                            {purchase.status_pagamento === 'pendente' && purchase.expira_em && (
                                                <button
                                                    className="btn-finalizar-pagamento-compact"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/checkout/${purchase.id}`);
                                                    }}
                                                >
                                                    💳 Finalizar Pagamento
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {hasMore && searchTerm === '' && (
                                <div className="load-more-container" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            cursor: isLoadingMore ? 'wait' : 'pointer',
                                            color: '#333',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {isLoadingMore ? 'Carregando...' : 'Carregar Mais Títulos'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MyTicketsPage;
