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
import type { Winner } from '../models/types';
import './WinnersPage.css';

// Mock winners data
const mockWinners: Winner[] = [
    {
        id: '1',
        name: 'João Silva',
        campaignTitle: 'iPhone 15 Pro Max',
        prize: 'iPhone 15 Pro Max 256GB',
        luckyNumber: '001234',
        drawDate: '15/12/2025',
        phone: '(11) 98765-4321',
        avatar: ''
    },
    {
        id: '2',
        name: 'Maria Santos',
        campaignTitle: 'Moto G84',
        prize: 'Moto G84 128GB',
        luckyNumber: '007890',
        drawDate: '10/12/2025',
        phone: '(21) 91234-5678',
        avatar: ''
    },
    {
        id: '3',
        name: 'Pedro Oliveira',
        campaignTitle: 'Galaxy S23',
        prize: 'Samsung Galaxy S23 Ultra',
        luckyNumber: '004567',
        drawDate: '05/12/2025',
        phone: '(31) 99876-5432',
        avatar: ''
    }
];

const WinnersPage: React.FC = () => {
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
                        <Trophy size={32} className="winners-icon" />
                        <h1>Ganhadores</h1>
                        <p className="winners-subtitle">Confira os sortudos que já ganharam com a gente!</p>
                    </div>

                    <div className="winners-grid">
                        {mockWinners.map((winner: Winner) => (
                            <WinnerCard key={winner.id} winner={winner} />
                        ))}
                    </div>

                    {mockWinners.length === 0 && (
                        <div className="no-winners">
                            <Trophy size={48} />
                            <p>Ainda não temos ganhadores. Seja o primeiro!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default WinnersPage;
