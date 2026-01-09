
/**
 * Página de Detalhes da Campanha
 * View Layer - MVC Pattern
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

import '../App.css'; // Garantir estilos globais

const CampaignDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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
    const [ticketQuantity, setTicketQuantity] = useState(1);

    // UI States
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // Mock packages if not in campaign
    const packages = [
        { count: 72, price: 5.04 },
        { count: 143, price: 10.01 },
        { count: 286, price: 20.02 },
        { count: 572, price: 40.04 },
        { count: 1286, price: 90.02 },
        { count: 2715, price: 190.05 },
    ];

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!id) return;
            try {
                // MOCK DATA FOR DEMONSTRATION since backend might not have details
                const mockCampaign: Campaign = {
                    id: Number(id),
                    title: "RAPIDINHA POP 110i 2026 0KM",
                    subtitle: "PARTICIPE E CONCORRA!",
                    image: "https://systempremios.me/images/campaigns/pop110.png",
                    status: 'active',
                    price: 0.07,
                    totalTickets: 100000,
                    soldTickets: 100000,
                    date: "07/01/2026"
                };

                setCampaign(mockCampaign);
            } catch (error) {
                console.error("Failed to fetch campaign", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaign();
    }, [id]);

    const handlePackageSelect = (count: number) => {
        setTicketQuantity(prev => Math.min(prev + count, 10000));
    };

    const handleQuantityChange = (delta: number) => {
        setTicketQuantity(prev => {
            const newValue = prev + delta;
            if (newValue > 10000) return 10000;
            return Math.max(1, newValue);
        });
    };

    const handleReset = () => {
        setTicketQuantity(1);
    };

    if (loading) return <div className="loading-screen">Carregando...</div>;
    if (!campaign) return <div className="error-screen">Campanha não encontrada</div>;

    const progress = campaign.totalTickets ? Math.min(100, Math.round((campaign.soldTickets || 0) / campaign.totalTickets * 100)) : 0;
    const totalPrice = (ticketQuantity * (campaign.price || 0)).toFixed(2);

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
                cpf={cpf}
                password={password}
                onCpfChange={setCpf}
                onPasswordChange={setPassword}
                onLogin={handleLogin}
                isLoading={authLoading}
                error={authError}
            />

            <main className="details-main">
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
                <div className="my-titles-bar">
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
            </main>

            {/* Sticky Bottom Bar */}
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
                </div>
            </div>

            <br /><br /><br />
            <Footer />
        </div>
    );
};

export default CampaignDetailsPage;
