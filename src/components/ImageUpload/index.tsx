import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import './ImageUpload.css';

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label = 'Imagem da Campanha',
    placeholder = 'Clique ou arraste para fazer upload'
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(value);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update preview when value changes externally
    React.useEffect(() => {
        setPreview(value);
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Limit size to 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setPreview(base64String);
            onChange(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview('');
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="image-upload-container">
            <label className="form-label">{label}</label>

            <div
                className={`image-upload-area ${isDragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {preview ? (
                    <div className="image-preview-wrapper">
                        <img src={preview} alt="Preview" className="image-preview" />
                        <button type="button" className="remove-image-btn" onClick={handleRemove} title="Remover imagem">
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <div className="icon-circle">
                            <Upload size={24} />
                        </div>
                        <p className="upload-text">{placeholder}</p>
                        <span className="upload-subtext">JPG, PNG ou WEBP (Max 5MB)</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
