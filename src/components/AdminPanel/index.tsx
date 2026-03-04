import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Edit, Trash2, AlertCircle, Trophy, Crown, Bell, Megaphone } from 'lucide-react';
import type { Campaign } from '../../models/types';
import { mapCampanhaToFrontend } from '../../utils/mappers';
import campanhaService from '../../services/campaignService';
import api from '../../services/api';
import CampaignForm from '../CampaignForm';
import ConfirmDialog from '../ConfirmDialog';
import Notification from '../Notification';
import PrizeTitlesModal from './PrizeTitlesModal';
import WinnerSelectionModal from './WinnerSelectionModal';
import './AdminPanel.css';

interface Comunicado {
    id: number;
    titulo: string;
    conteudo: string;
    tipo: string;
    ativo: boolean;
    criado_em: string;
}

const AdminPanel: React.FC = () => {
    const { isAdmin, handleLogout } = useAuthContext();
    const [activeTab, setActiveTab] = useState<'campanhas' | 'comunicados'>('campanhas');

    // Campaign state
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [prizeModalCampaign, setPrizeModalCampaign] = useState<Campaign | null>(null);
    const [winnerModalCampaign, setWinnerModalCampaign] = useState<Campaign | null>(null);

    // Comunicados state
    const [comunicados, setComunicados] = useState<Comunicado[]>([]);
    const [comunicadosLoading, setComunicadosLoading] = useState(false);
    const [showComunicadoForm, setShowComunicadoForm] = useState(false);
    const [editingComunicado, setEditingComunicado] = useState<Comunicado | null>(null);
    const [deleteComunicadoConfirm, setDeleteComunicadoConfirm] = useState<number | null>(null);
    const [comunicadoForm, setComunicadoForm] = useState({ titulo: '', conteudo: '', tipo: 'informativo' });

    // Shared
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    useEffect(() => {
        if (activeTab === 'comunicados' && comunicados.length === 0) {
            loadComunicados();
        }
    }, [activeTab]);

    // ========== CAMPAIGNS ==========
    const loadCampaigns = async () => {
        try {
            setIsLoading(true);
            const response = await campanhaService.listar({ per_page: 100 });
            const mappedCampaigns = response.data.campanhas.map(mapCampanhaToFrontend);
            setCampaigns(mappedCampaigns);
        } catch (error) {
            showNotification('error', 'Erro ao carregar campanhas');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampaign = async (data: any) => {
        try {
            const apiData = {
                titulo: data.title,
                descricao: data.description,
                imagem_principal: data.image || '',
                codigo: data.code || '',
                tipo: data.type || 'regular',
                premio: data.prize || data.title,
                valor_titulo: data.price,
                total_titulos: data.totalTickets,
                min_quantidade_compra: data.minQuantity || 1,
                max_quantidade_compra: data.maxQuantity || null,
                data_sorteio: data.date || null,
                regulamento: data.regulations || '',
                status: data.status === 'active' ? 'ativo' : 'concluido'
            };

            const response = await campanhaService.criar(apiData as any);
            const newCampaign = mapCampanhaToFrontend(response.data.campanha);
            setCampaigns([newCampaign, ...campaigns]);
            setShowForm(false);
            showNotification('success', 'Campanha criada com sucesso!');
        } catch (error) {
            showNotification('error', 'Erro ao criar campanha');
            console.error(error);
        }
    };

    const handleUpdateCampaign = async (id: number, data: any) => {
        try {
            const apiData = {
                titulo: data.title,
                descricao: data.description,
                imagem_principal: data.image,
                codigo: data.code,
                tipo: data.type,
                premio: data.prize,
                valor_titulo: data.price,
                total_titulos: data.totalTickets,
                min_quantidade_compra: data.minQuantity,
                max_quantidade_compra: data.maxQuantity,
                data_sorteio: data.date || null,
                regulamento: data.regulations,
                status: data.status === 'active' ? 'ativo' : 'concluido'
            };

            const response = await campanhaService.atualizar(id, apiData as any);
            const updated = mapCampanhaToFrontend(response.data.campanha);
            setCampaigns(campaigns.map(c => c.id === id ? updated : c));
            setEditingCampaign(null);
            showNotification('success', 'Campanha atualizada com sucesso!');
        } catch (error) {
            showNotification('error', 'Erro ao atualizar campanha');
            console.error(error);
        }
    };

    const handleDeleteCampaign = async (id: number) => {
        try {
            await campanhaService.deletar(id);
            setCampaigns(campaigns.filter(c => c.id !== id));
            setDeleteConfirm(null);
            showNotification('success', 'Campanha excluída com sucesso!');
        } catch (error: any) {
            const backendError = error.response?.data?.erro || error.response?.data?.mensagem || '';
            if (backendError.includes('compras associadas')) {
                showNotification('error', '🔒 Bloqueado: Não é possível excluir campanhas que já possuem vendas.');
            } else {
                showNotification('error', backendError || 'Erro ao excluir campanha');
            }
            console.error(error);
        }
    };

    // ========== COMUNICADOS ==========
    const loadComunicados = async () => {
        try {
            setComunicadosLoading(true);
            const response = await api.get('/api/comunicados');
            setComunicados(response.data.comunicados || []);
        } catch (error) {
            showNotification('error', 'Erro ao carregar comunicados');
            console.error(error);
        } finally {
            setComunicadosLoading(false);
        }
    };

    const handleCreateComunicado = async () => {
        if (!comunicadoForm.titulo.trim() || !comunicadoForm.conteudo.trim()) {
            showNotification('error', 'Título e conteúdo são obrigatórios');
            return;
        }
        try {
            const response = await api.post('/api/comunicados', comunicadoForm);
            setComunicados([response.data.comunicado, ...comunicados]);
            setComunicadoForm({ titulo: '', conteudo: '', tipo: 'informativo' });
            setShowComunicadoForm(false);
            showNotification('success', 'Comunicado criado com sucesso!');
        } catch (error) {
            showNotification('error', 'Erro ao criar comunicado');
            console.error(error);
        }
    };

    const handleUpdateComunicado = async () => {
        if (!editingComunicado) return;
        try {
            const response = await api.put(`/api/comunicados/${editingComunicado.id}`, comunicadoForm);
            setComunicados(comunicados.map(c => c.id === editingComunicado.id ? response.data.comunicado : c));
            setEditingComunicado(null);
            setComunicadoForm({ titulo: '', conteudo: '', tipo: 'informativo' });
            showNotification('success', 'Comunicado atualizado!');
        } catch (error) {
            showNotification('error', 'Erro ao atualizar comunicado');
            console.error(error);
        }
    };

    const handleDeleteComunicado = async (id: number) => {
        try {
            await api.delete(`/api/comunicados/${id}`);
            setComunicados(comunicados.filter(c => c.id !== id));
            setDeleteComunicadoConfirm(null);
            showNotification('success', 'Comunicado excluído!');
        } catch (error) {
            showNotification('error', 'Erro ao excluir comunicado');
            console.error(error);
        }
    };

    const startEditComunicado = (c: Comunicado) => {
        setEditingComunicado(c);
        setComunicadoForm({ titulo: c.titulo, conteudo: c.conteudo, tipo: c.tipo });
        setShowComunicadoForm(true);
    };

    const cancelComunicadoForm = () => {
        setShowComunicadoForm(false);
        setEditingComunicado(null);
        setComunicadoForm({ titulo: '', conteudo: '', tipo: 'informativo' });
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    if (!isAdmin) {
        return (
            <div className="admin-panel-denied">
                <AlertCircle size={48} />
                <h2>Acesso Negado</h2>
                <p>Você não tem permissão para acessar esta página.</p>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'campanhas' ? 'active' : ''}`}
                        onClick={() => setActiveTab('campanhas')}
                    >
                        <Megaphone size={18} style={{ marginRight: '0.5rem' }} />
                        Campanhas
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'comunicados' ? 'active' : ''}`}
                        onClick={() => setActiveTab('comunicados')}
                    >
                        <Bell size={18} style={{ marginRight: '0.5rem' }} />
                        Comunicados
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="nav-item logout" onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                {/* ========== CAMPANHAS TAB ========== */}
                {activeTab === 'campanhas' && (
                    <>
                        <div className="admin-page-header">
                            <h1>Gerenciamento de Campanhas</h1>
                            <button
                                className="btn-add-campaign"
                                onClick={() => setShowForm(true)}
                            >
                                + Adicionar Campanhas
                            </button>
                        </div>

                        <div className="admin-content-card">
                            {isLoading ? (
                                <div className="loading-state">Carregando campanhas...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Início</th>
                                                <th>Fim</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {campaigns.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="empty-cell">Nenhuma campanha encontrada</td>
                                                </tr>
                                            ) : (
                                                campaigns.map((campaign) => (
                                                    <tr key={campaign.id}>
                                                        <td className="cell-name">{campaign.title}</td>
                                                        <td>{campaign.createdAt ? new Date(campaign.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                                                        <td>{campaign.date ? new Date(campaign.date).toLocaleDateString('pt-BR') : '-'}</td>
                                                        <td>
                                                            <span className={`status-pill status-${campaign.status === 'active' ? 'ativo' : 'inativo'}`}>
                                                                {campaign.status === 'active' ? 'Ativa' : 'Inativa'}
                                                            </span>
                                                        </td>
                                                        <td className="cell-actions">
                                                            <button className="action-btn edit" onClick={() => setPrizeModalCampaign(campaign)} title="Títulos Premiados">
                                                                <Trophy size={16} />
                                                            </button>
                                                            <button className="action-btn edit" onClick={() => setWinnerModalCampaign(campaign)} title="Definir Ganhador" style={{ color: '#eab308' }}>
                                                                <Crown size={16} />
                                                            </button>
                                                            <button className="action-btn edit" onClick={() => setEditingCampaign(campaign)} title="Editar">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="action-btn delete" onClick={() => setDeleteConfirm(campaign.id)} title="Excluir">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ========== COMUNICADOS TAB ========== */}
                {activeTab === 'comunicados' && (
                    <>
                        <div className="admin-page-header">
                            <h1>Gerenciamento de Comunicados</h1>
                            <button
                                className="btn-add-campaign"
                                onClick={() => { cancelComunicadoForm(); setShowComunicadoForm(true); }}
                            >
                                + Novo Comunicado
                            </button>
                        </div>

                        {/* Create/Edit Form */}
                        {showComunicadoForm && (
                            <div className="admin-content-card" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: '#111827' }}>
                                    {editingComunicado ? 'Editar Comunicado' : 'Novo Comunicado'}
                                </h3>
                                <div className="comunicado-form">
                                    <div className="comunicado-form-group">
                                        <label>Título *</label>
                                        <input
                                            type="text"
                                            value={comunicadoForm.titulo}
                                            onChange={(e) => setComunicadoForm({ ...comunicadoForm, titulo: e.target.value })}
                                            placeholder="Título do comunicado"
                                            className="comunicado-input"
                                        />
                                    </div>
                                    <div className="comunicado-form-group">
                                        <label>Tipo</label>
                                        <select
                                            value={comunicadoForm.tipo}
                                            onChange={(e) => setComunicadoForm({ ...comunicadoForm, tipo: e.target.value })}
                                            className="comunicado-input"
                                        >
                                            <option value="informativo">Informativo</option>
                                            <option value="alerta">Alerta</option>
                                            <option value="aviso">Aviso</option>
                                        </select>
                                    </div>
                                    <div className="comunicado-form-group">
                                        <label>Conteúdo *</label>
                                        <textarea
                                            value={comunicadoForm.conteudo}
                                            onChange={(e) => setComunicadoForm({ ...comunicadoForm, conteudo: e.target.value })}
                                            placeholder="Conteúdo do comunicado..."
                                            className="comunicado-textarea"
                                            rows={4}
                                        />
                                    </div>
                                    <div className="comunicado-form-actions">
                                        <button
                                            className="btn-add-campaign"
                                            onClick={editingComunicado ? handleUpdateComunicado : handleCreateComunicado}
                                        >
                                            {editingComunicado ? 'Salvar Alterações' : 'Criar Comunicado'}
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={cancelComunicadoForm}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comunicados List */}
                        <div className="admin-content-card">
                            {comunicadosLoading ? (
                                <div className="loading-state">Carregando comunicados...</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Título</th>
                                                <th>Tipo</th>
                                                <th>Data</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comunicados.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="empty-cell">Nenhum comunicado encontrado</td>
                                                </tr>
                                            ) : (
                                                comunicados.map((comunicado) => (
                                                    <tr key={comunicado.id}>
                                                        <td className="cell-name">{comunicado.titulo}</td>
                                                        <td>
                                                            <span className={`status-pill tipo-${comunicado.tipo}`}>
                                                                {comunicado.tipo}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(comunicado.criado_em).toLocaleDateString('pt-BR')}</td>
                                                        <td>
                                                            <span className={`status-pill ${comunicado.ativo ? 'status-ativo' : 'status-inativo'}`}>
                                                                {comunicado.ativo ? 'Ativo' : 'Inativo'}
                                                            </span>
                                                        </td>
                                                        <td className="cell-actions">
                                                            <button className="action-btn edit" onClick={() => startEditComunicado(comunicado)} title="Editar">
                                                                <Edit size={16} />
                                                            </button>
                                                            <button className="action-btn delete" onClick={() => setDeleteComunicadoConfirm(comunicado.id)} title="Excluir">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Modals — Campanhas */}
            {showForm && (
                <CampaignForm
                    onSubmit={handleCreateCampaign}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingCampaign && (
                <CampaignForm
                    campaign={editingCampaign}
                    onSubmit={(data) => handleUpdateCampaign(editingCampaign.id, data)}
                    onCancel={() => setEditingCampaign(null)}
                />
            )}

            {prizeModalCampaign && (
                <PrizeTitlesModal
                    campaignId={prizeModalCampaign.id}
                    campaignSlug={prizeModalCampaign.slug || ''}
                    campaignTitle={prizeModalCampaign.title}
                    onClose={() => setPrizeModalCampaign(null)}
                />
            )}

            {winnerModalCampaign && (
                <WinnerSelectionModal
                    campaignId={winnerModalCampaign.id}
                    campaignTitle={winnerModalCampaign.title}
                    onClose={() => setWinnerModalCampaign(null)}
                    onSuccess={() => {
                        showNotification('success', 'Ganhador definido com sucesso!');
                        loadCampaigns();
                    }}
                />
            )}

            {deleteConfirm && (
                <ConfirmDialog
                    title="Excluir Campanha"
                    message="Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita."
                    onConfirm={() => handleDeleteCampaign(deleteConfirm)}
                    onCancel={() => setDeleteConfirm(null)}
                />
            )}

            {deleteComunicadoConfirm && (
                <ConfirmDialog
                    title="Excluir Comunicado"
                    message="Tem certeza que deseja excluir este comunicado?"
                    onConfirm={() => handleDeleteComunicado(deleteComunicadoConfirm)}
                    onCancel={() => setDeleteComunicadoConfirm(null)}
                />
            )}

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default AdminPanel;

