/**
 * Winners Page
 * Displays all winners from raffles
 */

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import WinnerCard from '../components/WinnerCard';
import { useAuthContext } from '../context/AuthContext';
import campanhaService from '../services/campaignService';
import type { Winner } from '../models/types';
import './WinnersPage.css';



const WinnersPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [winners, setWinners] = useState<Winner[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        cpf,
        password,
        isLoading: authLoading,
        error: authError,
        setCpf,
        setPassword,
        handleLogin
    } = useAuthContext();

    React.useEffect(() => {
        const fetchWinners = async () => {
            try {
                const response = await campanhaService.listarGanhadores(100); // Fetch up to 100 winners
                setWinners(response.data.ganhadores || []);
            } catch (error) {
                console.error('Erro ao buscar ganhadores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWinners();
    }, []);

    return (
        <div className="winners-page">
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

            <main className="winners-main">
                <div className="container">
                    <div className="winners-header">
                        <div className="winners-branding">
                            <span className="brand-text">o presente da</span>
                            <span className="brand-highlight">sorte</span>
                            <span className="brand-icon">🍀</span>
                        </div>
                        <p className="winners-subtitle">Confira os sortudos que já ganharam com a gente!</p>
                    </div>

                    {loading ? (
                        <div className="loading-state">Carregando ganhadores...</div>
                    ) : (
                        <>
                            <div className="winners-grid">
                                {winners.map((winner: Winner) => (
                                    <WinnerCard key={winner.id} winner={winner} />
                                ))}
                            </div>

                            {winners.length === 0 && (
                                <div className="no-winners">
                                    <Trophy size={48} />
                                    <p>Ainda não temos ganhadores. Seja o primeiro!</p>
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

export default WinnersPage;
