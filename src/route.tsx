/**
 * Application Routes
 * Defines routing structure for the application
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import RegisterPage from './pages/RegisterPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import WinnersPage from './pages/WinnersPage';
import MyTicketsPage from './pages/MyTicketsPage';
import MyTicketsDetailsPage from './pages/MyTicketsDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPanel from './components/AdminPanel';
import ComunicadosPage from './pages/ComunicadosPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';

import CampaignDetailsPage from './pages/CampaignDetailsPage';
import ProfilePage from './pages/ProfilePage';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAdmin } = useAuthContext();

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/campanhas" element={<CampaignsPage />} />
                <Route path="/campanha/:slug" element={<CampaignDetailsPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/termos-de-uso" element={<TermsPage />} />
                <Route path="/contato" element={<ContactPage />} />
                <Route path="/ganhadores" element={<WinnersPage />} />
                <Route path="/meus-titulos" element={<MyTicketsPage />} />
                <Route path="/meus-titulos/:compraId" element={<MyTicketsDetailsPage />} />
                <Route path="/checkout/:compraId" element={<CheckoutPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/comunicados" element={<ComunicadosPage />} />
                <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
                <Route path="/politica-de-cookies" element={<CookiePolicyPage />} />
                <Route
                    path="/painel-secreto-x9"
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
