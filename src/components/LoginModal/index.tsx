/**
 * Componente Modal de Login
 * View Layer - MVC Pattern
 */

import React, { useState } from 'react';
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
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCpfChange(maskPhone(e.target.value));
    };

    const handleContinue = () => {
        if (cpf.length >= 14) { // Phone with mask (XX) XXXXX-XXXX
            setStep(2);
        }
    };

    const handleClose = () => {
        setStep(1);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Botão de Fechar */}
                <button
                    onClick={handleClose}
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

                    {step === 1 ? (
                        <>
                            {/* Passo 1: Telefone */}
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

                            {/* Alerta Amarelo */}
                            <div className="warning-box">
                                <AlertTriangle size={20} className="warning-icon" />
                                <span>Informe seu telefone para continuar</span>
                            </div>

                            {/* Botão Continuar */}
                            <button
                                onClick={handleContinue}
                                className="btn btn-primary btn-full"
                                disabled={cpf.length < 14}
                            >
                                Continuar
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Passo 2: Senha */}
                            <p className="step-subtitle">Olá! Digite sua senha para entrar.</p>

                            <div className="form-group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => onPasswordChange(e.target.value)}
                                    className="form-input"
                                    placeholder="Senha"
                                    autoFocus
                                />
                            </div>

                            {/* Link Esqueci Senha */}
                            <button className="forgot-password" disabled={isLoading}>
                                Esqueci minha senha
                            </button>

                            {/* Botão Entrar */}
                            <button
                                onClick={onLogin}
                                className="btn btn-primary btn-full"
                                disabled={isLoading || !password}
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

                            <button
                                onClick={() => setStep(1)}
                                className="btn btn-outline btn-full"
                                style={{ marginTop: '1rem' }}
                            >
                                Voltar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
