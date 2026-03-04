/**
 * Comunicados Page
 * Displays announcements/communications from the platform
 */

import React, { useState, useEffect } from 'react';
import { Gift, Bell } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';
import LoginModal from '../components/LoginModal';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';
import './ComunicadosPage.css';

interface Comunicado {
    id: number;
    titulo: string;
    conteudo: string;
    tipo: string;
    criado_em: string;
}

const ComunicadosPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const {
        cpf,
        password,
        isLoading: authLoading,
        error: authError,
        setCpf,
        setPassword,
        handleLogin
    } = useAuthContext();

    useEffect(() => {
        const fetchComunicados = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/api/comunicados');
                setComunicados(response.data.comunicados || []);
            } catch (error) {
                console.error('Erro ao buscar comunicados:', error);
                setComunicados([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComunicados();
    }, []);

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch {
            return dateString;
        }
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'alerta': return '⚠️';
            case 'aviso': return '📢';
            default: return '🎁';
        }
    };

    return (
        <div className="comunicados-page">
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

            <main className="comunicados-main">
                <div className="container">
                    <div className="comunicados-content">
                        <div className="comunicados-header">
                            <Gift size={24} className="comunicados-icon" />
                            <h1>Comunicados</h1>
                        </div>

                        <div className="comunicados-body">
                            {isLoading ? (
                                <div className="comunicados-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Carregando comunicados...</p>
                                </div>
                            ) : comunicados.length === 0 ? (
                                <div className="comunicados-empty">
                                    <Bell size={32} className="empty-bell" />
                                    <p>Nenhum comunicado até o momento!</p>
                                </div>
                            ) : (
                                <div className="comunicados-list">
                                    {comunicados.map((comunicado) => (
                                        <div key={comunicado.id} className={`comunicado-card tipo-${comunicado.tipo || 'informativo'}`}>
                                            <div className="comunicado-header">
                                                <span className="comunicado-tipo-icon">
                                                    {getTipoIcon(comunicado.tipo)}
                                                </span>
                                                <h2 className="comunicado-titulo">{comunicado.titulo}</h2>
                                                <span className="comunicado-data">
                                                    {formatDate(comunicado.criado_em)}
                                                </span>
                                            </div>
                                            <div className="comunicado-conteudo">
                                                <p>{comunicado.conteudo}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ComunicadosPage;
