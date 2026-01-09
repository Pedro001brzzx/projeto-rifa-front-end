/**
 * Admin Panel Component
 * Admin-only dashboard for campaign management
 */

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import type { Campaign } from '../../models/types';
import * as campaignService from '../../services/campaignService';
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
            const data = await campaignService.getCampaigns();
            setCampaigns(data);
        } catch (error) {
            showNotification('error', 'Erro ao carregar campanhas');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampaign = async (data: Omit<Campaign, 'id'>) => {
        try {
            const newCampaign = await campaignService.createCampaign(data);
            setCampaigns([newCampaign, ...campaigns]);
            setShowForm(false);
            showNotification('success', 'Campanha criada com sucesso!');
        } catch (error) {
            showNotification('error', 'Erro ao criar campanha');
        }
    };

    const handleUpdateCampaign = async (id: number, data: Partial<Campaign>) => {
        try {
            const updated = await campaignService.updateCampaign(id, data);
            setCampaigns(campaigns.map(c => c.id === id ? updated : c));
            setEditingCampaign(null);
            showNotification('success', 'Campanha atualizada com sucesso!');
        } catch (error) {
            showNotification('error', 'Erro ao atualizar campanha');
        }
    };

    const handleDeleteCampaign = async (id: number) => {
        try {
            await campaignService.deleteCampaign(id);
            setCampaigns(campaigns.filter(c => c.id !== id));
            setDeleteConfirm(null);
            showNotification('success', 'Campanha excluída com sucesso!');
        } catch (error) {
            showNotification('error', 'Erro ao excluir campanha');
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
        <div className="admin-panel">
            <div className="container">
                {/* Header */}
                <div className="admin-header">
                    <div>
                        <h1>Painel Administrativo</h1>
                        <p>Gerencie todas as campanhas</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={20} />
                        Nova Campanha
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>{campaigns.length}</h3>
                        <p>Total de Campanhas</p>
                    </div>
                    <div className="stat-card">
                        <h3>{campaigns.filter(c => c.status === 'active').length}</h3>
                        <p>Campanhas Ativas</p>
                    </div>
                    <div className="stat-card">
                        <h3>{campaigns.filter(c => c.status === 'concluded').length}</h3>
                        <p>Campanhas Concluídas</p>
                    </div>
                </div>

                {/* Campaigns Table */}
                <div className="admin-content">
                    <h2>Campanhas</h2>
                    {isLoading ? (
                        <div className="loading">Carregando...</div>
                    ) : campaigns.length === 0 ? (
                        <div className="empty-state">
                            <p>Nenhuma campanha encontrada</p>
                        </div>
                    ) : (
                        <div className="campaigns-table">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="campaign-row">
                                    <div className="campaign-row-image">
                                        <img src={campaign.image} alt={campaign.title} />
                                    </div>
                                    <div className="campaign-row-info">
                                        <h3>{campaign.title}</h3>
                                        <p>{campaign.subtitle}</p>
                                        <span className={`status-badge status-${campaign.status}`}>
                                            {campaign.status === 'active' ? 'Ativa' : 'Concluída'}
                                        </span>
                                    </div>
                                    <div className="campaign-row-actions">
                                        <button
                                            className="btn-icon btn-edit"
                                            onClick={() => setEditingCampaign(campaign)}
                                            title="Editar"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="btn-icon btn-delete"
                                            onClick={() => setDeleteConfirm(campaign.id)}
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
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
