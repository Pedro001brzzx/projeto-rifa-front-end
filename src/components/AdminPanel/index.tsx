import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import type { Campaign } from '../../models/types';
import { mapCampanhaToFrontend } from '../../utils/mappers';
import campanhaService from '../../services/campaignService';
import CampaignForm from '../CampaignForm';
import ConfirmDialog from '../ConfirmDialog';
import Notification from '../Notification';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
    const { isAdmin } = useAuthContext();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Load campaigns on mount
    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setIsLoading(true);
            const response = await campanhaService.listar({ per_page: 100 });
            // Map API response to frontend model
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
            // Map frontend data to backend API format
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

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    // Redirect if not admin
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
                    <button className="nav-item active">Campanhas</button>
                    <button className="nav-item">Usuários</button>
                    <button className="nav-item">Relatórios</button>
                    <button className="nav-item">Configurações</button>
                </nav>
            </aside>

            <main className="admin-main">
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
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => setEditingCampaign(campaign)}
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => setDeleteConfirm(campaign.id)}
                                                        title="Excluir"
                                                    >
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
            </main>

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

            {deleteConfirm && (
                <ConfirmDialog
                    title="Excluir Campanha"
                    message="Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita."
                    onConfirm={() => handleDeleteCampaign(deleteConfirm)}
                    onCancel={() => setDeleteConfirm(null)}
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
