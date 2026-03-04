import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Trophy, User, Crown, AlertCircle } from 'lucide-react';

import { prizeTitlesService } from '../../services/prizeTitlesService';
import campanhaService from '../../services/campaignService';
import { maskPhone } from '../../utils/masks';
import type { TituloPremiado } from '../../types/api.types';
import './PrizeTitlesModal.css';

interface PrizeTitlesModalProps {
    campaignId: number | string;
    campaignSlug: string;
    campaignTitle: string;
    onClose: () => void;
}

const PrizeTitlesModal: React.FC<PrizeTitlesModalProps> = ({
    campaignId,
    campaignSlug,
    campaignTitle,
    onClose
}) => {
    const [titles, setTitles] = useState<TituloPremiado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states — Adicionar título
    const [newNumber, setNewNumber] = useState('');
    const [newValue, setNewValue] = useState('');
    const [adding, setAdding] = useState(false);

    // States — Confirmação de ganhador
    const [confirmingId, setConfirmingId] = useState<number | null>(null);
    const [winnerFeedback, setWinnerFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadTitles();
    }, [campaignSlug]);

    const loadTitles = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await prizeTitlesService.getPrizeTitles(campaignSlug);
            setTitles(data.titulos_premiados);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar títulos.');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNumber || !newValue) return;

        try {
            setAdding(true);
            await prizeTitlesService.addPrizeTitle(campaignId, {
                numero_titulo: newNumber,
                valor_premio: parseFloat(newValue)
            });
            setNewNumber('');
            setNewValue('');
            await loadTitles();
        } catch (err) {
            console.error(err);
            alert('Erro ao adicionar título.');
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja remover este título?')) return;
        try {
            await prizeTitlesService.deletePrizeTitle(id);
            setTitles(titles.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
            alert('Erro ao remover título.');
        }
    };

    const handleConfirmWinner = async (title: TituloPremiado) => {
        if (!title.dono) return;
        if (!window.confirm(`Confirmar "${title.dono.nome}" (cota ${title.numero_titulo}) como ganhador desta campanha?`)) return;

        setConfirmingId(title.id);
        setWinnerFeedback(null);
        try {
            await campanhaService.definirGanhador(campaignId, {
                compra_id: title.dono.compra_id,
                titulo_id: title.dono.titulo_id
            });
            setWinnerFeedback({
                type: 'success',
                message: `✅ Ganhador definido: ${title.dono.nome} — cota ${title.numero_titulo}`
            });
            await loadTitles();
        } catch (err) {
            console.error(err);
            setWinnerFeedback({ type: 'error', message: '❌ Erro ao definir ganhador. Tente novamente.' });
        } finally {
            setConfirmingId(null);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container prize-modal">
                <div className="modal-header">
                    <h2>Gerenciar Títulos Premiados</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-subheader">
                    <p>Campanha: <strong>{campaignTitle}</strong></p>
                </div>

                <div className="modal-content">
                    {/* ===== Adicionar Título ===== */}
                    <form className="add-prize-form" onSubmit={handleAdd}>
                        <div className="form-group">
                            <label>Número do Título</label>
                            <input
                                type="text"
                                value={newNumber}
                                onChange={e => setNewNumber(e.target.value)}
                                placeholder="Ex: 12345"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Valor do Prêmio (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={newValue}
                                onChange={e => setNewValue(e.target.value)}
                                placeholder="Ex: 500.00"
                                required
                            />
                        </div>
                        <button type="submit" className="add-btn" disabled={adding}>
                            <Plus size={18} />
                            {adding ? 'Adicionando...' : 'Adicionar'}
                        </button>
                    </form>

                    <hr className="divider" />

                    {/* ===== Feedback de ganhador ===== */}
                    {winnerFeedback && (
                        <div className={`winner-feedback winner-feedback--${winnerFeedback.type}`}>
                            {winnerFeedback.message}
                        </div>
                    )}

                    {/* ===== Lista de Títulos com dono automático ===== */}
                    {loading ? (
                        <p className="loading-text">Carregando...</p>
                    ) : error ? (
                        <p className="error-text">{error}</p>
                    ) : titles.length === 0 ? (
                        <p className="empty-text">Nenhum título premiado cadastrado.</p>
                    ) : (
                        <div className="prize-titles-list">
                            <div className="list-header prize-list-header-extended">
                                <span>Número</span>
                                <span>Valor</span>
                                <span>Dono / Status</span>
                                <span>Ações</span>
                            </div>

                            {titles.map(title => (
                                <div key={title.id} className={`list-item-extended ${title.status === 'ganho' ? 'item-won' : ''}`}>
                                    {/* Número */}
                                    <span className="font-mono">{title.numero_titulo}</span>

                                    {/* Valor */}
                                    <span className="text-green">R$ {title.valor_premio.toFixed(2)}</span>

                                    {/* Dono / Status */}
                                    <div className="dono-cell">
                                        {title.status === 'ganho' ? (
                                            <span className="badge-won">
                                                <Trophy size={12} /> {title.ganhador_nome || 'Ganhador definido'}
                                            </span>
                                        ) : title.dono ? (
                                            <div className="dono-info">
                                                <div className="dono-avatar">
                                                    <User size={14} />
                                                </div>
                                                <div className="dono-details">
                                                    <span className="dono-nome">{title.dono.nome}</span>
                                                    <span className="dono-tel">{maskPhone(title.dono.telefone)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="dono-nenhum">
                                                <AlertCircle size={13} /> Sem dono
                                            </span>
                                        )}
                                    </div>

                                    {/* Ações */}
                                    <div className="actions-cell">
                                        {title.status !== 'ganho' && title.dono && (
                                            <button
                                                className="confirm-winner-btn"
                                                onClick={() => handleConfirmWinner(title)}
                                                disabled={confirmingId === title.id}
                                                title="Definir como Ganhador"
                                            >
                                                {confirmingId === title.id ? (
                                                    '...'
                                                ) : (
                                                    <><Crown size={14} /> Definir</>
                                                )}
                                            </button>
                                        )}
                                        <button
                                            className="delete-btn-icon"
                                            onClick={() => handleDelete(title.id)}
                                            title="Remover"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrizeTitlesModal;
