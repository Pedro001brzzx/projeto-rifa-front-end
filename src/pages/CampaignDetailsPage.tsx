
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
    X
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import MobileMenu from '../components/MobileMenu';
import PrizeTitles from '../components/PrizeTitles';
import { useAuthContext } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import type { Campaign } from '../models/types';
// TEMPORARILY DISABLED - Prize titles integration causing crash
// import type { TituloPremiado } from '../types/api.types';
import { campanhaService } from '../services/campaignService';
import { paymentService } from '../services/paymentService';
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

    // TEMPORARILY DISABLED - Prize Titles State
    // const [prizeTitles, setPrizeTitles] = useState<TituloPremiado[]>([]);
    // const [prizeTitlesStats, setPrizeTitlesStats] = useState({ total: 0, ganhos: 0, disponiveis: 0 });

    // UI States
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // Get user from Auth Context
    const { user, authenticated } = useAuth();

    // Calculate packages dynamically based on campaign price
    const getPackages = () => {
        if (!campaign) return [];

        const ticketPrice = campaign.price;
        return [
            { count: 100, price: parseFloat((100 * ticketPrice).toFixed(2)) },
            { count: 200, price: parseFloat((200 * ticketPrice).toFixed(2)) },
            { count: 300, price: parseFloat((300 * ticketPrice).toFixed(2)) },
            { count: 500, price: parseFloat((500 * ticketPrice).toFixed(2)) },
            { count: 1000, price: parseFloat((1000 * ticketPrice).toFixed(2)) },
            { count: 1500, price: parseFloat((1500 * ticketPrice).toFixed(2)) },
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

        // TEMPORARILY DISABLED - Prize Titles Fetch
        // const fetchPrizeTitles = async () => {
        //     if (!slug) return;
        //     try {
        //         const data = await prizeTitlesService.getPrizeTitles(slug);
        //         setPrizeTitles(data.titulos_premiados);
        //         setPrizeTitlesStats({
        //             total: data.total,
        //             ganhos: data.ganhos,
        //             disponiveis: data.disponiveis
        //         });
        //     } catch (err) {
        //         console.error('Erro ao buscar títulos premiados:', err);
        //     }
        // };

        fetchCampaign();
        // fetchPrizeTitles();
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

    const handleParticipateClick = async () => {
        // Check if user is authenticated
        if (!authenticated || !user) {
            setLoginModalOpen(true);
            return;
        }

        // Check if campaign has ID
        if (!campaign?.id) {
            alert('Erro: ID da campanha não encontrado');
            return;
        }

        try {
            setLoading(true);

            // Create checkout via API
            const response = await paymentService.criarCheckout({
                campanha_id: campaign.id,
                quantidade_titulos: ticketQuantity,
                metodo_pagamento: 'pix',
            });

            // Redirect to checkout page with compra_id
            navigate(`/checkout/${response.data.compra_id}`);

        } catch (error: any) {
            console.error('Erro ao criar checkout:', error);

            // Tratamento de erro profissional (Fintech Standard)
            const errorData = error.response?.data;
            const errorMessage = errorData?.erro || 'Erro ao processar pedido. Tente novamente.';

            if (errorData?.categoria === 'perfil_incompleto') {
                alert(errorMessage);
                navigate('/perfil');
                return;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    // Calculate total price dynamically
    const totalPrice = campaign
        ? (ticketQuantity * campaign.price).toFixed(2)
        : '0.00';

    // Get max tickets available (menor entre limite do sistema e disponíveis)
    // const campaignLimit = campaign?.availableTickets || campaign?.totalTickets || Infinity;
    // const maxTickets = Math.min(10000, campaignLimit);

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

            {/* CheckoutModal removed - using API checkout instead */}

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
                        {/* Hero Container - Wrapped in Box */}
                        <div className="container">
                            <div className="hero-container-box">
                                {/* Hero Image */}
                                <div className="details-hero">
                                    <img src={campaign.image} alt={campaign.title} className="details-image" />
                                    {campaign.status === 'active' && <div className="status-badge">Adquira Já!</div>}
                                </div>

                                {/* Title Section */}
                                <div className="details-header">
                                    <h1 className="details-title">{campaign.title}</h1>
                                    <p className="details-subtitle">{campaign.subtitle}</p>
                                </div>

                                {/* My Titles Bar */}
                                <div className="my-titles-bar" onClick={handleMyTicketsClick} style={{ cursor: 'pointer' }}>
                                    <div className="flex-center">
                                        <ShoppingCart size={20} />
                                        <span>Meus títulos</span>
                                    </div>
                                </div>

                                {/* Campaign Info Bar */}
                                <div className="campaign-info-bar">
                                    <div className="info-item">
                                        <span className="info-label">Por apenas</span>
                                        <span className="info-value-price">R$ {campaign.price?.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="container">
                            <div className="section-box">
                                <div className="instruction-box">
                                    Quanto mais títulos, mais chances de ganhar!
                                </div>
                            </div>
                        </div>

                        {/* Packages Grid */}
                        <div className="container">
                            <div className="section-box">
                                <div className="packages-grid">
                                    {packages.map((pkg) => (
                                        <div
                                            key={pkg.count}
                                            className={`package-card ${ticketQuantity === pkg.count ? 'selected' : ''}`}
                                            onClick={() => handlePackageSelect(pkg.count)}
                                        >
                                            <div className="package-popular-tag">Mais popular</div>
                                            <div className="package-count">+{pkg.count}</div>
                                            <div className="package-action">SELECIONAR</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Controls Section - MOVED HERE */}
                        <div className="container">
                            <div className="section-box">
                                <div className="controls-section">
                                    <div className="quantity-control">
                                        <button className="reset-btn" onClick={handleReset} title="Limpar quantidade"><X size={20} /></button>
                                        <button onClick={() => handleQuantityChange(-1)}><Minus size={20} /></button>
                                        <input type="text" value={ticketQuantity} readOnly />
                                        <button onClick={() => handleQuantityChange(1)}><Plus size={20} /></button>
                                    </div>
                                    <button className="participate-btn-inline" onClick={handleParticipateClick}>
                                        <div className="btn-content-inline">
                                            <span className="btn-icon">→</span>
                                            <div className="btn-text">
                                                <span className="btn-label-inline">Participar</span>
                                                <span className="btn-price-inline">R$ {totalPrice.replace('.', ',')}</span>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description Button */}
                        <div className="container">
                            <div className="section-box">
                                <button className="desc-btn">
                                    <ChevronDown size={20} />
                                    Descrição/Regulamento
                                </button>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <div className="container">
                            <div className="section-box">
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{ width: `${progress}%` }}>
                                        {progress}%
                                    </div>
                                </div>

                                {progress >= 100 && (
                                    <div className="warning-box-yellow">
                                        Todos os títulos disponíveis já foram pagos ou reservados.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prize Titles Section */}
                        <div className="container">
                            <div className="section-box">
                                <PrizeTitles
                                    prizes={[
                                        { id: 1, campanha_id: 0, numero_titulo: "1111", valor_premio: 1000, ganhador_nome: "Maria", status: 'ganho', data_sorteio: null, criado_em: '', atualizado_em: '', ganhador_usuario_id: null },
                                        { id: 2, campanha_id: 0, numero_titulo: "222222", valor_premio: 1000, ganhador_nome: "Jackeline", status: 'ganho', data_sorteio: null, criado_em: '', atualizado_em: '', ganhador_usuario_id: null },
                                        { id: 3, campanha_id: 0, numero_titulo: "333333", valor_premio: 1000, ganhador_nome: "Sebastião", status: 'ganho', data_sorteio: null, criado_em: '', atualizado_em: '', ganhador_usuario_id: null },
                                        { id: 4, campanha_id: 0, numero_titulo: "444444", valor_premio: 1000, ganhador_nome: null, status: 'disponivel', data_sorteio: null, criado_em: '', atualizado_em: '', ganhador_usuario_id: null },
                                        { id: 5, campanha_id: 0, numero_titulo: "555555", valor_premio: 1000, ganhador_nome: null, status: 'disponivel', data_sorteio: null, criado_em: '', atualizado_em: '', ganhador_usuario_id: null },
                                    ]}
                                    totalCount={5}
                                    wonCount={3}
                                />
                            </div>
                        </div>
                    </>
                )}
            </main>

            <br /><br /><br />
            <Footer />
        </div>
    );
};

export default CampaignDetailsPage;
