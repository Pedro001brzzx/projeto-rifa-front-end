
/**
 * Página de Detalhes da Campanha
 * View Layer - MVC Pattern
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    ChevronDown,
    Minus,
    Plus,
    CheckCircle,
    Award,
    RotateCcw
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import MobileMenu from '../components/MobileMenu';
import { useAuthContext } from '../context/AuthContext';
import type { Campaign } from '../models/types';
import { campanhaService } from '../services/campaignService';
import { mapCampanhaToFrontend } from '../utils/mappers';

import '../App.css'; // Garantir estilos globais

const CampaignDetailsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const {
        cpf,
        password,
        isLoading: authLoading,
        error: authError,
        setCpf,
        setPassword,
        handleLogin
    } = useAuthContext();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);

    // UI States
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // Calculate packages dynamically based on campaign price
    const getPackages = () => {
        if (!campaign) return [];

        const ticketPrice = campaign.price;
        return [
            { count: 72, price: parseFloat((72 * ticketPrice).toFixed(2)) },
            { count: 143, price: parseFloat((143 * ticketPrice).toFixed(2)) },
            { count: 286, price: parseFloat((286 * ticketPrice).toFixed(2)) },
            { count: 572, price: parseFloat((572 * ticketPrice).toFixed(2)) },
            { count: 1286, price: parseFloat((1286 * ticketPrice).toFixed(2)) },
            { count: 2715, price: parseFloat((2715 * ticketPrice).toFixed(2)) },
        ];
    };

    const packages = getPackages();

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!slug) {
                setError('Slug da campanha não encontrado');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await campanhaService.obterDetalhes(slug);
                const frontendCampaign = mapCampanhaToFrontend(response.data);

                setCampaign(frontendCampaign);
            } catch (err) {
                console.error('Erro ao buscar campanha:', err);
                setError('Não foi possível carregar a campanha. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [slug]);

    const handlePackageSelect = (count: number) => {
        if (!campaign) return;
        const campaignLimit = campaign.availableTickets || campaign.totalTickets || Infinity;
        const maxTickets = Math.min(10000, campaignLimit); // Menor entre 10k e disponíveis
        setTicketQuantity(prev => Math.min(prev + count, maxTickets));
    };

    const handleQuantityChange = (delta: number) => {
        if (!campaign) return;
        const campaignLimit = campaign.availableTickets || campaign.totalTickets || Infinity;
        const maxTickets = Math.min(10000, campaignLimit); // Menor entre 10k e disponíveis

        setTicketQuantity(prev => {
            const newValue = prev + delta;
            if (newValue > maxTickets) return maxTickets;
            return Math.max(1, newValue);
        });
    };

    const handleReset = () => {
        setTicketQuantity(1);
    };

    const handleMyTicketsClick = () => {
        navigate('/meus-titulos');
    };

    // Calculate total price dynamically
    const totalPrice = campaign
        ? (ticketQuantity * campaign.price).toFixed(2)
        : '0.00';

    // Get max tickets available (menor entre limite do sistema e disponíveis)
    const campaignLimit = campaign?.availableTickets || campaign?.totalTickets || Infinity;
    const maxTickets = Math.min(10000, campaignLimit);

    if (loading) return <div className="loading-screen">Carregando...</div>;
    if (!campaign) return <div className="error-screen">Campanha não encontrada</div>;

    const progress = campaign.totalTickets ? Math.min(100, Math.round((campaign.soldTickets || 0) / campaign.totalTickets * 100)) : 0;

    return (
        <div className="campaign-details-page">
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
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Carregando campanha...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
                        >
                            Tentar Novamente
                        </button>
                    </div>
                ) : !campaign ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Campanha não encontrada</p>
                    </div>
                ) : (
                    <>
                        {/* Hero Image */}
                        <div className="details-hero">
                            <img src={campaign.image} alt={campaign.title} className="details-image" />
                            {campaign.status === 'active' && <div className="status-badge">Adquira Já!</div>}
                        </div>

                        {/* Title Section */}
                        <div className="details-header container">
                            <h1 className="details-title">{campaign.title}</h1>
                            <p className="details-subtitle">{campaign.subtitle}</p>
                        </div>

                        {/* My Titles Bar */}
                        <div className="my-titles-bar" onClick={handleMyTicketsClick} style={{ cursor: 'pointer' }}>
                            <div className="container flex-center">
                                <ShoppingCart size={20} />
                                <span>Meus títulos</span>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="stats-bar container">
                            <div className="price-tag">
                                <span>Por apenas</span>
                                <div className="price-value">R$ {campaign.price?.toFixed(2).replace('.', ',')}</div>
                            </div>

                            <button className="top-buyers-btn">
                                <Award size={18} />
                                Top Compradores Diário
                            </button>
                        </div>

                        {/* Instructions */}
                        <div className="container">
                            <div className="instruction-box">
                                Quanto mais títulos, mais chances de ganhar!
                            </div>
                        </div>

                        {/* Packages Grid */}
                        <div className="container">
                            <div className="packages-grid">
                                {packages.map((pkg) => (
                                    <div
                                        key={pkg.count}
                                        className={`package-card ${ticketQuantity === pkg.count ? 'selected' : ''}`}
                                        onClick={() => handlePackageSelect(pkg.count)}
                                    >
                                        <div className="package-popular-tag">Mais popular</div>
                                        <div className="package-count">+{pkg.count}</div>
                                        <div className="package-price">R$ {pkg.price.toFixed(2).replace('.', ',')}</div>
                                        <div className="package-action">SELECIONAR</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="container progress-section">
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${progress}%` }}>
                                    {progress}%
                                </div>
                            </div>
                            <div className="draw-info">
                                <div className="draw-date">
                                    <span>Sorteio</span>
                                    <strong>{campaign.date || 'TBA'}</strong>
                                </div>
                                <div className="draw-price">
                                    <span>Por apenas</span>
                                    <div className="price-badge">R$ {campaign.price?.toFixed(2).replace('.', ',')}</div>
                                </div>
                            </div>

                            {progress >= 100 && (
                                <div className="warning-box-yellow">
                                    Todos os títulos disponíveis já foram pagos ou reservados.
                                </div>
                            )}
                        </div>

                        {/* Description Button */}
                        <div className="container desc-btn-container">
                            <button className="desc-btn">
                                <ChevronDown size={20} />
                                Descrição/Regulamento
                            </button>
                        </div>

                        {/* Titulos Premiados List (Mock) */}
                        <div className="container section-premiados">
                            <div className="section-header">
                                <h3>🏆 Títulos Premiados</h3>
                                <span className="badge-green">0/5</span>
                            </div>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div className="award-item" key={i}>
                                    <span className="award-value">R$1.000,00 REAIS</span>
                                    <span className="award-status">Disponível</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Sticky Bottom Bar */}
            {campaign && !loading && !error && (
                <div className="sticky-action-bar">
                    <div className="container">
                        {/* Quick Adjust Bar */}
                        <div className="quick-adjust-bar">
                            {[-100, -50, -20, -10, 10, 20, 50, 100].map((val) => (
                                <button
                                    key={val}
                                    className={`adjust-chip ${val > 0 ? 'positive' : 'negative'}`}
                                    onClick={() => handleQuantityChange(val)}
                                >
                                    {val > 0 ? `+${val}` : val}
                                </button>
                            ))}
                            <button className="reset-quantity-btn" onClick={handleReset} title="Remover a quantidade de rifas">
                                <RotateCcw size={16} />
                                Limpar
                            </button>
                        </div>

                        <div className="flex-row">
                            <div className="quantity-control">
                                <button onClick={() => handleQuantityChange(-1)}><Minus size={20} /></button>
                                <input type="text" value={ticketQuantity} readOnly />
                                <button onClick={() => handleQuantityChange(1)}><Plus size={20} /></button>
                            </div>
                            <button className="participate-btn">
                                <div className="btn-content">
                                    <span className="btn-label"><CheckCircle size={16} /> Quero participar</span>
                                    <span className="btn-price">R$ {totalPrice.replace('.', ',')}</span>
                                </div>
                            </button>
                        </div>

                        {/* Indicador de limite */}
                        {ticketQuantity >= maxTickets && (
                            <div style={{
                                textAlign: 'center',
                                padding: '0.5rem',
                                color: '#ef4444',
                                fontSize: '0.85rem'
                            }}>
                                Limite máximo de {maxTickets.toLocaleString('pt-BR')} títulos atingido
                            </div>
                        )}
                    </div>
                </div>
            )}

            <br /><br /><br />
            <Footer />
        </div>
    );
};

export default CampaignDetailsPage;
