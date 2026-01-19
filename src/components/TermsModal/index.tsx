/**
 * Terms Acceptance Modal Component
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import './TermsModal.css';

interface TermsModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onCancel: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="terms-modal-overlay" onClick={onCancel}>
            <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="terms-modal-header">
                    <AlertCircle size={24} className="terms-icon" />
                    <h3>Termos de Uso</h3>
                </div>

                <div className="terms-modal-body">
                    <p>Por favor, concorde com os termos de uso para continuar.</p>
                    <p className="terms-message-detail">
                        Ao prosseguir, você declara que leu e concorda com nossos{' '}
                        <a href="/termos" target="_blank" className="terms-link-modal">
                            termos de uso
                        </a>.
                    </p>
                </div>

                <div className="terms-modal-actions">
                    <button className="terms-btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="terms-btn-accept" onClick={onAccept}>
                        Aceitar e Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
