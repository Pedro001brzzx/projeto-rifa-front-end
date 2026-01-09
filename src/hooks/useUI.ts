/**
 * Hook de Gerenciamento de UI
 * Controller Layer - MVC Pattern
 */

import { useState } from 'react';

export const useUI = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const openMobileMenu = () => {
        setMobileMenuOpen(true);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const openLoginModal = () => {
        setLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setLoginModalOpen(false);
    };

    return {
        mobileMenuOpen,
        loginModalOpen,
        toggleMobileMenu,
        openMobileMenu,
        closeMobileMenu,
        openLoginModal,
        closeLoginModal
    };
};
