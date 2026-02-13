import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, CreditCard, Save } from 'lucide-react';
import Header from '../components/Header';
import { useAuthContext } from '../context/AuthContext';
import { useUI } from '../hooks/useUI';
import LoginModal from '../components/LoginModal';
import MobileMenu from '../components/MobileMenu';
import { maskCPF } from '../utils/masks';
import { validateCPF, validateEmail } from '../utils/validators';
import authService from '../services/authService';

const ProfilePage: React.FC = () => {
    const { user, cpf, password, setCpf, setPassword, handleLogin, handleLogout, isAdmin, isLoading: authLoading, error: authError } = useAuthContext();
    const { mobileMenuOpen, loginModalOpen, toggleMobileMenu, openLoginModal, closeLoginModal } = useUI();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                nome: user.nome || '',
                email: user.email || '',
                telefone: user.telefone || '',
                cpf: maskCPF(user.cpf || '')
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let maskedValue = value;
        if (name === 'cpf') maskedValue = maskCPF(value);
        setFormData(prev => ({ ...prev, [name]: maskedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validações
        if (!validateEmail(formData.email)) {
            setError('E-mail inválido');
            return;
        }

        const cleanCPF = formData.cpf.replace(/\D/g, '');
        if (!validateCPF(cleanCPF)) {
            setError('CPF inválido');
            return;
        }

        setLoading(true);
        try {
            await authService.atualizarPerfil({
                nome: formData.nome,
                email: formData.email,
                cpf: cleanCPF,
                // telefone geralmente não é alterado aqui por segurança, 
                // mas podemos permitir se o backend suportar
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // Recarregar a página ou atualizar o contexto seria ideal
            window.location.reload();
        } catch (err: any) {
            setError(err.response?.data?.erro || 'Erro ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    if (!user && !authLoading) {
        return (
            <div className="profile-page-empty">
                <Header onLoginClick={openLoginModal} onMenuToggle={toggleMobileMenu} isMobileMenuOpen={mobileMenuOpen} />
                <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <h2>Você precisa estar logado para ver esta página</h2>
                    <button onClick={openLoginModal} className="submit-btn" style={{ maxWidth: '200px', margin: '20px auto' }}>Fazer Login</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <LoginModal
                isOpen={loginModalOpen}
                onClose={closeLoginModal}
                cpf={cpf || ''}
                password={password || ''}
                onCpfChange={setCpf || (() => { })}
                onPasswordChange={setPassword || (() => { })}
                onLogin={handleLogin || (async () => { })}
                isLoading={authLoading || false}
                error={authError || null}
            />
            <Header
                onLoginClick={openLoginModal}
                onMenuToggle={toggleMobileMenu}
                isMobileMenuOpen={mobileMenuOpen}
                isAdmin={isAdmin}
                onLogout={handleLogout}
            />
            <MobileMenu isOpen={mobileMenuOpen} onLoginClick={openLoginModal} onCloseMenu={toggleMobileMenu} />

            <div className="profile-page" style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8f9fa' }}>
                <div className="container" style={{ maxWidth: '600px', padding: '40px 20px' }}>
                    <div className="profile-card" style={{ background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <User size={28} color="#22c55e" /> Meu Perfil
                        </h1>

                        <p style={{ color: '#666', marginBottom: '32px' }}>
                            Mantenha seus dados atualizados para garantir a segurança de suas compras e recebimento de prêmios.
                        </p>

                        {error && (
                            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
                                Perfil atualizado com sucesso!
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Nome Completo</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="nome"
                                        className="form-input"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Seu nome completo"
                                        style={{ paddingLeft: '40px' }}
                                    />
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>E-mail</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="seu@email.com"
                                        style={{ paddingLeft: '40px' }}
                                    />
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>CPF</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="cpf"
                                        className="form-input"
                                        value={formData.cpf}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        style={{ paddingLeft: '40px' }}
                                    />
                                    <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Telefone</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="telefone"
                                        className="form-input"
                                        value={formData.telefone}
                                        disabled
                                        style={{ paddingLeft: '40px', background: '#f1f5f9', cursor: 'not-allowed' }}
                                    />
                                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                </div>
                                <small style={{ color: '#999', fontSize: '12px' }}>Por segurança, o telefone não pode ser alterado.</small>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {loading ? 'Salvando...' : <><Save size={20} /> Salvar Alterações</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
