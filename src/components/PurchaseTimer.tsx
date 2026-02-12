import React, { useState, useEffect } from 'react';
import './PurchaseTimer.css';

interface PurchaseTimerProps {
    expira_em: string | null;
    onExpired?: () => void;
    compact?: boolean;
}

const PurchaseTimer: React.FC<PurchaseTimerProps> = ({ expira_em, onExpired, compact = false }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!expira_em) {
            setIsExpired(true);
            return;
        }

        const calculateTimeLeft = () => {
            const expiraDate = new Date(expira_em);
            const now = new Date();

            // Validate if date is valid
            if (isNaN(expiraDate.getTime())) {
                setIsExpired(true);
                setTimeLeft(0);
                return 0;
            }

            const diff = expiraDate.getTime() - now.getTime();

            if (diff <= 0) {
                if (!isExpired) {
                    setIsExpired(true);
                    setTimeLeft(0);
                    onExpired?.();
                }
                return 0;
            }

            const secondsLeft = Math.floor(diff / 1000);

            // SAFEGUARD: Limit maximum time to 10 minutes (600 seconds)
            const MAX_SECONDS = 600; // 10 minutes
            if (secondsLeft > MAX_SECONDS) {
                return MAX_SECONDS;
            }

            return secondsLeft;
        };

        // Calcular imediatamente
        const initial = calculateTimeLeft();
        setTimeLeft(initial);

        // Atualizar a cada segundo
        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expira_em, onExpired]);

    if (isExpired || !expira_em) {
        return compact ? (
            <span className="timer-expired-compact">EXPIRADO</span>
        ) : (
            <div className="purchase-timer expired">
                ⏱️ Tempo expirado
            </div>
        );
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // Cores baseadas no tempo restante
    const urgency = minutes < 3 ? 'urgent' : minutes < 5 ? 'warning' : 'normal';

    if (compact) {
        return (
            <span className={`timer-compact ${urgency}`}>
                {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
        );
    }

    return (
        <div className={`purchase-timer ${urgency}`}>
            <span className="timer-icon">⏳</span>
            <span className="timer-text">
                Expira em: <strong>{minutes}min {seconds}s</strong>
            </span>
        </div>
    );
};

export default PurchaseTimer;
