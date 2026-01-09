/**
 * Confirm Dialog Component
 * Confirmation modal for destructive actions
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="confirm-dialog">
                <div className="confirm-icon">
                    <AlertTriangle size={48} />
                </div>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button onClick={onCancel} className="btn btn-outline">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="btn btn-danger">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
