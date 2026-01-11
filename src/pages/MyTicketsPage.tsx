/**
 * My Tickets Page
 * Displays user's purchased raffle tickets organized by campaign
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ChevronRight } from 'lucide-react';
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
        const fetchPurchases = async () => {
            // Redirect if not authenticated
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // Use new API service
                const response = await compraService.meusTitulos();

                // Transform API response to match Purchase interface
                const purchasesData: Purchase[] = response.data.compras.map((compra: any) => ({
                    id: compra.id,
                    campaignId: compra.campanha_id,
                    userId: compra.usuario_id,
                    quantity: compra.quantidade_titulos,
                    totalAmount: compra.valor_total,
                    purchaseDate: compra.data_compra,
                    campaign: compra.titulos?.[0]?.campanha ? {
                        id: compra.titulos[0].campanha.id,
                        title: compra.titulos[0].campanha.titulo,
                        subtitle: '',
                        image: compra.titulos[0].campanha.imagem_url,
                        status: compra.titulos[0].campanha.status === 'ativo' ? 'active' : 'concluded',
                        price: compra.titulos[0].campanha.valor_titulo
                    } : undefined
                }));

                setPurchases(purchasesData);
            } catch (err) {
                console.error('Error fetching purchases:', err);
                setError('Não foi possível carregar seus títulos. Tente novamente mais tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchases();
    }, [user]);

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

    const handlePurchaseClick = (campaignId: number) => {
        navigate(`/campanha/${campaignId}`);
    };

    const isCampaignExpired = (campaign: any): boolean => {
        return campaign?.status === 'concluded' || campaign?.status === 'expired';
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
                    <div className="my-tickets-header">
                        <Ticket size={24} className="my-tickets-icon" />
                        <h1>Meus títulos</h1>
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
                        <div className="my-tickets-list">
                            {purchases.map((purchase) => (
                                <div
                                    key={purchase.id}
                                    className="purchase-card"
                                    onClick={() => handlePurchaseClick(purchase.campaignId)}
                                >
                                    <div className="purchase-image">
                                        <img
                                            src={purchase.campaign?.image || '/placeholder.jpg'}
                                            alt={purchase.campaign?.title || 'Campanha'}
                                        />
                                    </div>

                                    <div className="purchase-info">
                                        <p className="purchase-date">
                                            {formatDate(purchase.purchaseDate)}
                                        </p>
                                        <h3 className="purchase-title">
                                            {purchase.campaign?.title || 'Campanha'}
                                        </h3>
                                        {isCampaignExpired(purchase.campaign) && (
                                            <span className="purchase-badge expired">Expirado</span>
                                        )}
                                        <p className="purchase-quantity">
                                            Quantidade: {purchase.quantity}
                                        </p>
                                        <p className="purchase-total">
                                            Total: {formatCurrency(purchase.totalAmount)}
                                        </p>
                                    </div>

                                    <div className="purchase-arrow">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MyTicketsPage;
