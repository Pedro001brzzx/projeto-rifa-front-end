import React, { useState } from 'react';
import { Search, Trophy, User, X } from 'lucide-react';
import campanhaService from '../../services/campaignService';
import { maskPhone } from '../../utils/masks';
import './AdminPanel.css'; // Reusing admin styles

interface WinnerSelectionModalProps {
    campaignId: number | string;
    campaignTitle: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface Buyer {
    compra_id: number;
    titulo_id?: number;
    usuario_id: number;
    nome: string;
    telefone: string;
    numero_titulo: string;
    data_compra: string;
}

const WinnerSelectionModal: React.FC<WinnerSelectionModalProps> = ({
    campaignId,
    campaignTitle,
    onClose,
    onSuccess
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setSearching(true);
        setError(null);
        try {
            const response = await campanhaService.buscarCompradores(campaignId, searchTerm);
            setBuyers(response.data.compradores || []);
        } catch (err) {
            console.error('Erro ao buscar compradores:', err);
            setError('Erro ao buscar compradores. Tente novamente.');
        } finally {
            setSearching(false);
        }
    };

    const handleConfirmWinner = async () => {
        if (!selectedBuyer) return;

        if (!window.confirm(`Tem certeza que deseja definir ${selectedBuyer.nome} como ganhador desta campanha?`)) {
            return;
        }

        setLoading(true);
        try {
            await campanhaService.definirGanhador(campaignId, {
                compra_id: selectedBuyer.compra_id,
                titulo_id: selectedBuyer.titulo_id
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Erro ao definir ganhador:', err);
            setError('Erro ao definir ganhador. Tente novamente.');
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
                <div className="modal-header">
                    <h2>Definir Ganhador</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <p className="modal-subtitle">
                        Selecione o ganhador para a campanha: <strong>{campaignTitle}</strong>
                    </p>

                    <form onSubmit={handleSearch} className="search-form" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input
                                type="text"
                                className="form-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nome, telefone ou cota..."
                                style={{ paddingLeft: '40px' }}
                            />
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={searching}>
                            {searching ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>

                    {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

                    <div className="buyers-list" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        {buyers.length > 0 ? (
                            buyers.map((buyer) => (
                                <div
                                    key={`${buyer.compra_id}-${buyer.numero_titulo}`}
                                    className={`buyer-item ${selectedBuyer?.compra_id === buyer.compra_id && selectedBuyer?.numero_titulo === buyer.numero_titulo ? 'selected' : ''}`}
                                    onClick={() => setSelectedBuyer(buyer)}
                                    style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #f1f5f9',
                                        cursor: 'pointer',
                                        backgroundColor: selectedBuyer?.compra_id === buyer.compra_id && selectedBuyer?.numero_titulo === buyer.numero_titulo ? '#f0fdf4' : 'transparent',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e2e8f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#64748b'
                                        }}>
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{buyer.nome}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>{maskPhone(buyer.telefone)}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '700', color: '#22c55e', fontSize: '16px' }}>{buyer.numero_titulo}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Cota</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                                {searchTerm && !searching ? 'Nenhum comprador encontrado' : 'Faça uma busca para encontrar o ganhador'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
                    <button
                        className="btn btn-primary"
                        onClick={handleConfirmWinner}
                        disabled={!selectedBuyer || loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {loading ? 'Salvando...' : <><Trophy size={18} /> Definir Ganhador</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinnerSelectionModal;
