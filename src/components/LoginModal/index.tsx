/**
 * Componente Modal de Login
 * View Layer - MVC Pattern
 */

import React from 'react';
import { X, Key, AlertTriangle, ArrowRight, Loader } from 'lucide-react';
import { maskPhone } from '../../utils/masks';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    cpf: string; // Keep name for backward compatibility, but will contain phone
    password: string;
    onCpfChange: (value: string) => void; // Keep name for backward compatibility
    onPasswordChange: (value: string) => void;
    onLogin: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isLoading?: boolean;
    error?: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    cpf,
    password,
    onCpfChange,
    onPasswordChange,
    onLogin,
    isLoading,
    error
}) => {
    if (!isOpen) return null;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCpfChange(maskPhone(e.target.value));
    };

    const isFormValid = cpf.length >= 14 && password.length > 0;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Botão de Fechar */}
                <button
                    onClick={onClose}
                    className="modal-close"
                >
                    <X size={24} />
                </button>

                {/* Cabeçalho com Ícone de Chave */}
                <div className="modal-header-login">
                    <Key size={24} className="modal-icon" />
                    <h2 className="modal-title">Login</h2>
                </div>

                {/* Formulário de Login */}
                <div className="login-form">
                    {/* Mensagem de Erro Geral */}
                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {/* Campo de Telefone */}
                    <div className="form-group">
                        <input
                            type="tel"
                            value={cpf}
                            onChange={handlePhoneChange}
                            className="form-input"
                            placeholder="Telefone*"
                            maxLength={15}
                            autoFocus
                        />
                    </div>

                    {/* Campo de Senha */}
                    <div className="form-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            className="form-input"
                            placeholder="Senha*"
                        />
                    </div>

                    {/* Alerta Amarelo */}
                    <div className="warning-box">
                        <AlertTriangle size={20} className="warning-icon" />
                        <span>Informe seu telefone e senha para continuar</span>
                    </div>

                    {/* Link Esqueci Senha */}
                    <button className="forgot-password" disabled={isLoading}>
                        Esqueci minha senha
                    </button>

                    {/* Botão Entrar */}
                    <button
                        onClick={onLogin}
                        className="btn btn-primary btn-full"
                        disabled={isLoading || !isFormValid}
                    >
                        {isLoading ? (
                            <>
                                <Loader size={18} className="spinner" />
                                Entrando...
                            </>
                        ) : (
                            <>
                                Entrar
                                <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;

