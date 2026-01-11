/**
 * Campaign Form Component
 * Form for creating and editing campaigns with comprehensive fields
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Campaign } from '../../models/types';
import './CampaignForm.css';

interface CampaignFormProps {
    campaign?: Campaign;
    onSubmit: (data: Omit<Campaign, 'id'>) => void;
    onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSubmit, onCancel }) => {
    // Form states for all fields
    const [titulo, setTitulo] = useState(campaign?.title || '');
    const [slug, setSlug] = useState('');
    const [descricao, setDescricao] = useState(campaign?.subtitle || '');
    const [codigo, setCodigo] = useState(campaign?.code || '');
    const [tipo, setTipo] = useState('');
    const [premio, setPremio] = useState('');
    const [valorTitulo, setValorTitulo] = useState('');
    const [totalTitulos, setTotalTitulos] = useState('');
    const [dataSorteio, setDataSorteio] = useState(campaign?.date || '');
    const [regulamento, setRegulamento] = useState('');
    const [status, setStatus] = useState<'active' | 'concluded'>(campaign?.status || 'active');

    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Auto-generate slug from title
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTituloChange = (value: string) => {
        setTitulo(value);
        if (!slug || slug === generateSlug(titulo)) {
            setSlug(generateSlug(value));
        }
    };



    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!titulo.trim()) newErrors.titulo = 'Título é obrigatório';
        if (!slug.trim()) newErrors.slug = 'Slug é obrigatório';
        if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';

        if (!valorTitulo.trim()) newErrors.valorTitulo = 'Valor do título é obrigatório';
        if (!totalTitulos.trim()) newErrors.totalTitulos = 'Total de títulos é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setIsUploading(true);

            const campaignData: Omit<Campaign, 'id'> = {
                title: titulo,
                subtitle: descricao,
                image: '', // Image URL will come from backend
                status,
                code: codigo || undefined,
                date: dataSorteio || undefined,
                price: parseFloat(valorTitulo) || 0,
                totalTickets: parseInt(totalTitulos) || 0,
                soldTickets: 0,
            };

            onSubmit(campaignData);
        } catch (error) {
            setErrors({ submit: 'Erro ao salvar campanha' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="campaign-form-modal">
                <div className="campaign-form-header">
                    <h2>{campaign ? 'Editar Campanha' : 'Criar Campanha'}</h2>
                    <button className="modal-close" onClick={onCancel}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="campaign-form">
                    <div className="form-grid">
                        {/* Título */}
                        <div className="form-group">
                            <label className="form-label">Título *</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => handleTituloChange(e.target.value)}
                                className={`form-input ${errors.titulo ? 'error' : ''}`}
                                placeholder="Digite o título da campanha"
                            />
                            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
                        </div>

                        {/* Slug */}
                        <div className="form-group">
                            <label className="form-label">Slug *</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className={`form-input ${errors.slug ? 'error' : ''}`}
                                placeholder="url-amigavel"
                            />
                            {errors.slug && <span className="error-message">{errors.slug}</span>}
                        </div>

                        {/* Descrição */}
                        <div className="form-group form-group-full">
                            <label className="form-label">Descrição *</label>
                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className={`form-input form-textarea ${errors.descricao ? 'error' : ''}`}
                                placeholder="Descrição da campanha"
                                rows={3}
                            />
                            {errors.descricao && <span className="error-message">{errors.descricao}</span>}
                        </div>

                        {/* Imagem será gerenciada pelo backend */}

                        {/* Código */}
                        <div className="form-group">
                            <label className="form-label">Código</label>
                            <input
                                type="text"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                className="form-input"
                                placeholder="Código da campanha"
                            />
                        </div>

                        {/* Tipo */}
                        <div className="form-group">
                            <label className="form-label">Tipo</label>
                            <input
                                type="text"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="form-input"
                                placeholder="Tipo de campanha"
                            />
                        </div>

                        {/* Prêmio */}
                        <div className="form-group form-group-full">
                            <label className="form-label">Prêmio</label>
                            <input
                                type="text"
                                value={premio}
                                onChange={(e) => setPremio(e.target.value)}
                                className="form-input"
                                placeholder="Descrição do prêmio"
                            />
                        </div>

                        {/* Valor do Título */}
                        <div className="form-group">
                            <label className="form-label">Valor do Título *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={valorTitulo}
                                onChange={(e) => setValorTitulo(e.target.value)}
                                className={`form-input ${errors.valorTitulo ? 'error' : ''}`}
                                placeholder="0.00"
                            />
                            {errors.valorTitulo && <span className="error-message">{errors.valorTitulo}</span>}
                        </div>

                        {/* Total de Títulos */}
                        <div className="form-group">
                            <label className="form-label">Total de Títulos *</label>
                            <input
                                type="number"
                                value={totalTitulos}
                                onChange={(e) => setTotalTitulos(e.target.value)}
                                className={`form-input ${errors.totalTitulos ? 'error' : ''}`}
                                placeholder="100000"
                            />
                            {errors.totalTitulos && <span className="error-message">{errors.totalTitulos}</span>}
                        </div>

                        {/* Data do Sorteio */}
                        <div className="form-group">
                            <label className="form-label">Data do Sorteio</label>
                            <input
                                type="date"
                                value={dataSorteio}
                                onChange={(e) => setDataSorteio(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label className="form-label">Status *</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'active' | 'concluded')}
                                className="form-input"
                            >
                                <option value="active">Ativa</option>
                                <option value="concluded">Concluída</option>
                            </select>
                        </div>

                        {/* Regulamento */}
                        <div className="form-group form-group-full">
                            <label className="form-label">Regulamento</label>
                            <textarea
                                value={regulamento}
                                onChange={(e) => setRegulamento(e.target.value)}
                                className="form-input form-textarea"
                                placeholder="Regulamento da campanha"
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-outline"
                            disabled={isUploading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isUploading}
                        >
                            {isUploading ? 'Salvando...' : campaign ? 'Atualizar' : 'Criar Campanha'}
                        </button>
                    </div>

                    {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
                </form>
            </div>
        </div>
    );
};

export default CampaignForm;
