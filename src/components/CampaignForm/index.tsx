/**
 * Campaign Form Component
 * Form for creating and editing campaigns
 */

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import type { Campaign } from '../../models/types';
import * as campaignService from '../../services/campaignService';
import './CampaignForm.css';

interface CampaignFormProps {
    campaign?: Campaign;
    onSubmit: (data: Omit<Campaign, 'id'>) => void;
    onCancel: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(campaign?.title || '');
    const [subtitle, setSubtitle] = useState(campaign?.subtitle || '');
    const [status, setStatus] = useState<'active' | 'concluded'>(campaign?.status || 'active');
    const [badge, setBadge] = useState(campaign?.badge || '');
    const [code, setCode] = useState(campaign?.code || '');
    const [date, setDate] = useState(campaign?.date || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(campaign?.image || '');
    const [isUploading, setIsUploading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setErrors({ ...errors, image: 'Por favor, selecione uma imagem válida' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, image: 'A imagem deve ter no máximo 5MB' });
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors({ ...errors, image: '' });
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) {
            newErrors.title = 'Título é obrigatório';
        } else if (title.length > 100) {
            newErrors.title = 'Título deve ter no máximo 100 caracteres';
        }

        if (!subtitle.trim()) {
            newErrors.subtitle = 'Subtítulo é obrigatório';
        } else if (subtitle.length > 200) {
            newErrors.subtitle = 'Subtítulo deve ter no máximo 200 caracteres';
        }

        if (!campaign?.image && !imageFile) {
            newErrors.image = 'Imagem é obrigatória';
        }

        if (badge && badge.length > 50) {
            newErrors.badge = 'Badge deve ter no máximo 50 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setIsUploading(true);

            // Upload image if a new file was selected
            let imageUrl = campaign?.image || '';
            if (imageFile) {
                imageUrl = await campaignService.uploadImage(imageFile);
            }

            const campaignData: Omit<Campaign, 'id'> = {
                title,
                subtitle,
                image: imageUrl,
                status,
                badge: badge || undefined,
                code: code || undefined,
                date: date || undefined,
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
                    <h2>{campaign ? 'Editar Campanha' : 'Nova Campanha'}</h2>
                    <button className="modal-close" onClick={onCancel}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="campaign-form">
                    {/* Title */}
                    <div className="form-group">
                        <label className="form-label">Título *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            maxLength={100}
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    {/* Subtitle */}
                    <div className="form-group">
                        <label className="form-label">Subtítulo *</label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => setSubtitle(e.target.value)}
                            className={`form-input ${errors.subtitle ? 'error' : ''}`}
                            maxLength={200}
                        />
                        {errors.subtitle && <span className="error-message">{errors.subtitle}</span>}
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label className="form-label">Imagem *</label>
                        <div className="image-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="image-input"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="image-upload-label">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                ) : (
                                    <div className="image-placeholder">
                                        <Upload size={32} />
                                        <span>Clique para fazer upload</span>
                                        <span className="image-hint">JPG ou PNG, máx. 5MB</span>
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.image && <span className="error-message">{errors.image}</span>}
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

                    {/* Badge (optional) */}
                    <div className="form-group">
                        <label className="form-label">Badge (opcional)</label>
                        <input
                            type="text"
                            value={badge}
                            onChange={(e) => setBadge(e.target.value)}
                            className={`form-input ${errors.badge ? 'error' : ''}`}
                            maxLength={50}
                        />
                        {errors.badge && <span className="error-message">{errors.badge}</span>}
                    </div>

                    {/* Code (optional) */}
                    <div className="form-group">
                        <label className="form-label">Código (opcional)</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="form-input"
                        />
                    </div>

                    {/* Date (optional) */}
                    <div className="form-group">
                        <label className="form-label">Data (opcional)</label>
                        <input
                            type="text"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="form-input"
                            placeholder="Ex: 17/12"
                        />
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
                            {isUploading ? 'Salvando...' : campaign ? 'Atualizar' : 'Criar'}
                        </button>
                    </div>

                    {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
                </form>
            </div>
        </div>
    );
};

export default CampaignForm;
