/**
 * Checkout Timer Component
 * Displays countdown timer for payment expiration
 */

import React, { useState, useEffect } from 'react';
import './CheckoutTimer.css';

interface CheckoutTimerProps {
    expiresAt: string; // ISO timestamp
    onExpired: () => void;
}

export const CheckoutTimer: React.FC<CheckoutTimerProps> = ({
    expiresAt,
    onExpired
}) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                if (!hasExpired) {
                    setHasExpired(true);
                    onExpired();
                }
                return 0;
            }

            return Math.floor(diff / 1000); // segundos
        };

        setTimeLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpired, hasExpired]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const isUrgent = timeLeft < 120; // Menos de 2 minutos
    const isVeryUrgent = timeLeft < 60; // Menos de 1 minuto

    if (hasExpired) {
        return null;
    }

    return (
        <div className={`checkout-timer ${isUrgent ? 'urgent' : ''} ${isVeryUrgent ? 'very-urgent' : ''}`}>
            <div className="timer-icon">⏳</div>
            <div className="timer-content">
                <span className="timer-label">Você tem</span>
                <span className="timer-value">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="timer-sublabel">para pagar</span>
            </div>
        </div>
    );
};

export default CheckoutTimer;
