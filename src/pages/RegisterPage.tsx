/**
 * Register Page - Página de Cadastro
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import type { RegisterFormData } from '../models/types';
import { maskCPF, maskCEP, maskDate } from '../utils/masks';
import { validateCPF, validateEmail, validateCEP } from '../utils/validators';

// Components
import Header from '../components/Header';
import LoginModal from '../components/LoginModal';
import MobileMenu from '../components/MobileMenu';

// Hooks and Context
import { useAuthContext } from '../context/AuthContext';
import { useUI } from '../hooks/useUI';

const BRAZILIAN_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    // Auth Context
    const {
        cpf,
        password,
        isAdmin,
        isLoading: authLoading,
        error: authError,
        setCpf,
        setPassword,
        handleLogin,
        handleLogout,
        register
    } = useAuthContext();

    // UI State
    const {
        mobileMenuOpen,
        loginModalOpen,
        toggleMobileMenu,
        openLoginModal,
        closeLoginModal
    } = useUI();

    const [formData, setFormData] = useState<RegisterFormData>({
        fullName: '',
        cpf: '',
        socialName: '',
        phone: '',
        phoneConfirmation: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        state: '',
        city: '',
        complement: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let maskedValue = value;
        if (name === 'cpf') maskedValue = maskCPF(value);
        if (name === 'cep') maskedValue = maskCEP(value);
        if (name === 'birthDate') maskedValue = maskDate(value);

        setFormData(prev => ({ ...prev, [name]: maskedValue }));
        if (errors[name as keyof RegisterFormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const fetchAddress = async (cep: string) => {
        const cleanCEP = cep.replace(/\D/g, '');
        if (cleanCEP.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro || '',
                        neighborhood: data.bairro || '',
                        city: data.localidade || '',
                        state: data.uf || ''
                    }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleCEPBlur = () => {
        if (validateCEP(formData.cep)) {
            fetchAddress(formData.cep);
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Nome completo é obrigatório';
        if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
        if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Telefone inválido';
        if (formData.phone !== formData.phoneConfirmation) newErrors.phoneConfirmation = 'Telefones não coincidem';
        if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.password || formData.password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
        if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
        if (!validateCEP(formData.cep)) newErrors.cep = 'CEP inválido';
        if (!formData.street.trim()) newErrors.street = 'Logradouro é obrigatório';
        if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
        if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
        if (!formData.state) newErrors.state = 'UF é obrigatório';
        if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            // Preparar dados para envio à API
            const registroData = {
                nome: formData.fullName,
                telefone: formData.phone.replace(/\D/g, ''), // Remove formatação
                senha: formData.password, // Usar senha definida pelo usuário
                email: formData.email,
                cpf: formData.cpf.replace(/\D/g, ''), // Remove formatação
                cidade: formData.city,
                estado: formData.state
            };

            // Registrar usuário na API
            if (register) {
                await register(registroData);

                alert('Cadastro realizado com sucesso! Você será redirecionado para a página inicial.');
                navigate('/');
            } else {
                throw new Error('Serviço de registro não disponível');
            }
        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);

            // Tratamento de erro específico
            const errorMessage = error.response?.data?.mensagem
                || error.message
                || 'Erro ao realizar cadastro. Tente novamente.';

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handler para abrir o calendário
    const handleCalendarClick = () => {
        dateInputRef.current?.showPicker();
    };

    // Handler para quando a data é selecionada via calendário
    const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value; // Formato: YYYY-MM-DD
        if (selectedDate) {
            // Converter YYYY-MM-DD para DD/MM/YYYY
            const [year, month, day] = selectedDate.split('-');
            const formattedDate = `${day}/${month}/${year}`;
            setFormData(prev => ({ ...prev, birthDate: formattedDate }));
            if (errors.birthDate) {
                setErrors(prev => ({ ...prev, birthDate: '' }));
            }
        }
    };

    // Handler para login que também fecha o modal
    const handleLoginSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!handleLogin) return;
        try {
            await handleLogin(e);
            closeLoginModal();
        } catch (err) {
            // Error is handled by useAuth
        }
    };

    const handleAdminClick = () => {
        navigate('/admin');
    };

    return (
        <>
            {/* Modal de Login */}
            <LoginModal
                isOpen={loginModalOpen}
                onClose={closeLoginModal}
                cpf={cpf ?? ''}
                password={password ?? ''}
                onCpfChange={setCpf ?? (() => { })}
                onPasswordChange={setPassword ?? (() => { })}
                onLogin={handleLoginSubmit}
                isLoading={authLoading ?? false}
                error={authError ?? null}
            />

            {/* Header com Menu Mobile */}
            <Header
                onLoginClick={openLoginModal}
                onMenuToggle={toggleMobileMenu}
                isMobileMenuOpen={mobileMenuOpen}
                isAdmin={isAdmin}
                onAdminClick={handleAdminClick}
                onLogout={handleLogout}
            />

            <MobileMenu isOpen={mobileMenuOpen} onLoginClick={openLoginModal} onCloseMenu={toggleMobileMenu} />

            <div className="register-page">
                <div className="container">
                    <div className="register-card">
                        <h1 className="register-title">🙋 Faça o seu cadastro</h1>

                        <form className="register-form" onSubmit={handleSubmit}>
                            {/* Nome Completo */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="fullName"
                                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                                    placeholder="Nome Completo*"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                            </div>

                            {/* CPF */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="cpf"
                                    className={`form-input ${errors.cpf ? 'error' : ''}`}
                                    placeholder="CPF* (Ex: 123.456.789-09)"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    maxLength={14}
                                />
                                {errors.cpf && <span className="error-message">{errors.cpf}</span>}
                            </div>

                            {/* Nome Social */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="socialName"
                                    className="form-input"
                                    placeholder="Nome Social (opcional)"
                                    value={formData.socialName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Telefone */}
                            <div className="form-group">
                                <PhoneInput
                                    country={'br'}
                                    value={formData.phone}
                                    onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                                    containerClass="phone-input-container-register"
                                    inputClass="form-input"
                                    buttonClass="phone-dropdown-button"
                                    enableSearch={true}
                                    searchPlaceholder="Buscar país..."
                                    placeholder="Adicione seu numero"
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>

                            {/* Confirme o Telefone */}
                            <div className="form-group">
                                <PhoneInput
                                    country={'br'}
                                    value={formData.phoneConfirmation}
                                    onChange={(phone) => setFormData(prev => ({ ...prev, phoneConfirmation: phone }))}
                                    containerClass="phone-input-container-register"
                                    inputClass="form-input"
                                    buttonClass="phone-dropdown-button"
                                    enableSearch={true}
                                    searchPlaceholder="Buscar país..."
                                    placeholder="Confirme seu numero"
                                />
                                {errors.phoneConfirmation && <span className="error-message">{errors.phoneConfirmation}</span>}
                            </div>

                            {/* E-mail */}
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="E-mail*"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            {/* Senha */}
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Senha*"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            {/* Confirmar Senha */}
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirme sua Senha*"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>

                            {/* Data de Nascimento */}
                            <div className="form-group">
                                <div className="date-input-wrapper">
                                    {/* Input visível para digitação com máscara */}
                                    <input
                                        type="text"
                                        name="birthDate"
                                        className={`form-input ${errors.birthDate ? 'error' : ''}`}
                                        placeholder="Data de Nascimento* (DD/MM/AAAA)"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        maxLength={10}
                                    />
                                    {/* Input hidden para date picker */}
                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        onChange={handleDatePickerChange}
                                        style={{ display: 'none' }}
                                    />
                                    {/* Botão de calendário */}
                                    <button
                                        type="button"
                                        onClick={handleCalendarClick}
                                        className="calendar-btn"
                                        aria-label="Abrir calendário"
                                    >
                                        <Calendar size={20} />
                                    </button>
                                </div>
                                {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
                            </div>

                            {/* CEP */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="cep"
                                    className={`form-input ${errors.cep ? 'error' : ''}`}
                                    placeholder="CEP*"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    onBlur={handleCEPBlur}
                                />
                                {errors.cep && <span className="error-message">{errors.cep}</span>}
                            </div>

                            {/* Logradouro */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="street"
                                    className={`form-input ${errors.street ? 'error' : ''}`}
                                    placeholder="Logradouro*"
                                    value={formData.street}
                                    onChange={handleChange}
                                />
                                {errors.street && <span className="error-message">{errors.street}</span>}
                            </div>

                            {/* Número */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="number"
                                    className={`form-input ${errors.number ? 'error' : ''}`}
                                    placeholder="Número*"
                                    value={formData.number}
                                    onChange={handleChange}
                                />
                                {errors.number && <span className="error-message">{errors.number}</span>}
                            </div>

                            {/* Bairro */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="neighborhood"
                                    className={`form-input ${errors.neighborhood ? 'error' : ''}`}
                                    placeholder="Bairro*"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                />
                                {errors.neighborhood && <span className="error-message">{errors.neighborhood}</span>}
                            </div>

                            {/* UF e Cidade */}
                            <div className="form-row">
                                <div className="form-group form-half">
                                    <select
                                        name="state"
                                        className={`form-select ${errors.state ? 'error' : ''}`}
                                        value={formData.state}
                                        onChange={handleChange}
                                    >
                                        <option value="">UF*</option>
                                        {BRAZILIAN_STATES.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    {errors.state && <span className="error-message">{errors.state}</span>}
                                </div>

                                <div className="form-group form-half">
                                    <input
                                        type="text"
                                        name="city"
                                        className={`form-input ${errors.city ? 'error' : ''}`}
                                        placeholder="Cidade*"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                    {errors.city && <span className="error-message">{errors.city}</span>}
                                </div>
                            </div>

                            {/* Complemento */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="complement"
                                    className="form-input"
                                    placeholder="Complemento (opcional)"
                                    value={formData.complement}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Botão Submit */}
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Cadastrando...' : 'Concluir Cadastro →'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
