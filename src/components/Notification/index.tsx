/**
 * Notification Component
 * Toast notifications for success/error messages
 */

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Notification.css';

interface NotificationProps {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification notification-${type}`}>
            <div className="notification-icon">
                {type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
            </div>
            <div className="notification-message">{message}</div>
            <button className="notification-close" onClick={onClose}>
                <X size={20} />
            </button>
        </div>
    );
};

export default Notification;
