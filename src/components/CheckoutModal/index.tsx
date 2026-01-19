/**
 * Componente Modal de Checkout
 * View Layer - MVC Pattern
 */

import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import type { Campaign } from '../../models/types';
import type { Usuario } from '../../types/api.types';
import TermsModal from '../TermsModal';
import './CheckoutModal.css';

interface BonusOption {
    id: number;
    titles: number;
    price: number;
    roletas: number;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
    quantity: number;
    user: Usuario | null;
    onComplete: (data: { quantity: number; totalPrice: number; bonuses: number[] }) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    campaign,
    quantity,
    user,
    onComplete
}) => {
    const [selectedBonuses, setSelectedBonuses] = useState<number[]>([]);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

    if (!isOpen) return null;

    // Define bonus options matching the design
    const bonusOptions: BonusOption[] = [
        { id: 1, titles: 143, price: 10.01, roletas: 1 },
        { id: 2, titles: 215, price: 15.05, roletas: 2 },
        { id: 3, titles: 286, price: 20.02, roletas: 4 },
        { id: 4, titles: 429, price: 30.05, roletas: 6 }
    ];

    const toggleBonus = (id: number) => {
        setSelectedBonuses(prev =>
            prev.includes(id)
                ? prev.filter(bonusId => bonusId !== id)
                : [...prev, id]
        );
    };

    // Calculate totals
    const basePrice = quantity * campaign.price;
    const bonusTitles = bonusOptions
        .filter(opt => selectedBonuses.includes(opt.id))
        .reduce((sum, opt) => sum + opt.titles, 0);
    const bonusPrice = bonusOptions
        .filter(opt => selectedBonuses.includes(opt.id))
        .reduce((sum, opt) => sum + opt.price, 0);
    const totalQuantity = quantity + bonusTitles;
    const totalPrice = basePrice + bonusPrice;

    const handleComplete = () => {
        if (!agreedToTerms) {
            setShowTermsModal(true);
            return;
        }
        onComplete({
            quantity: totalQuantity,
            totalPrice,
            bonuses: selectedBonuses
        });
    };

    const handleAcceptTerms = () => {
        setAgreedToTerms(true);
        setShowTermsModal(false);
        // Automatically proceed after accepting
        onComplete({
            quantity: totalQuantity,
            totalPrice,
            bonuses: selectedBonuses
        });
    };

    // Mask phone number (show only last 4 digits)
    const maskPhone = (phone: string) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length <= 4) return phone;
        return phone.replace(/\d(?=\d{4})/g, '*');
    };

    return (
        <>
            <TermsModal
                isOpen={showTermsModal}
                onAccept={handleAcceptTerms}
                onCancel={() => setShowTermsModal(false)}
            />

            <div className="modal-overlay" onClick={onClose}>
                <div className="checkout-modal-content" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="checkout-header">
                        <div className="checkout-header-left">
                            <ShoppingCart size={24} />
                            <h2>Checkout</h2>
                        </div>
                        <button onClick={onClose} className="modal-close">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Success Message */}
                    <div className="checkout-success-box">
                        <div className="success-icon">✓</div>
                        <p>
                            Você está adquirindo <strong>{quantity}</strong> unidade(s) do produto{' '}
                            <strong>{campaign.title}</strong>
                        </p>
                    </div>

                    {/* Bonus Options */}
                    <div className="checkout-bonuses">
                        <h3 className="bonuses-title">AUMENTE SUAS CHANCES 🚀</h3>
                        <p className="bonuses-subtitle">Com mais números você tem mais chances de ganhar 🤑</p>

                        <div className="bonus-options">
                            {bonusOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`bonus-option ${selectedBonuses.includes(option.id) ? 'selected' : ''}`}
                                    onClick={() => toggleBonus(option.id)}
                                >
                                    <div className="bonus-toggle">
                                        <div className={`toggle-switch ${selectedBonuses.includes(option.id) ? 'active' : ''}`}>
                                            <div className="toggle-slider"></div>
                                        </div>
                                    </div>
                                    <div className="bonus-info">
                                        <div className="bonus-text">
                                            Que tal adicionar <strong>+{option.titles}</strong> títulos por apenas{' '}
                                            <strong>R$ {option.price.toFixed(2).replace('.', ',')}</strong>
                                        </div>
                                        <div className="bonus-reward">GANHE {option.roletas} ROLETAS PREMIADAS</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="checkout-user-info">
                        <div className="user-avatar">
                            <div className="avatar-placeholder"></div>
                        </div>
                        <div className="user-details">
                            <div className="user-name">{user?.nome || 'PEDRO HENRIQUE ALVES LOPES'}</div>
                            <div className="user-phone">{maskPhone(user?.telefone || '(83) 9****-****')}</div>
                        </div>
                    </div>

                    {/* Terms Agreement */}
                    <div className="checkout-terms">
                        <p>
                            Ao efetuar este pagamento e confirmar a compra deste título de capitalização, declaro que li e concordo com os{' '}
                            <a href="/termos" target="_blank" className="terms-link">termos de uso</a>.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <button className="checkout-complete-btn" onClick={handleComplete}>
                        Concluir Reserva
                        <div className="btn-arrow">→</div>
                    </button>

                    <button className="checkout-change-account" onClick={onClose}>
                        Alterar conta
                    </button>
                </div>
            </div>
        </>
    );
};

export default CheckoutModal;
