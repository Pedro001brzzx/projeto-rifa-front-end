
import React, { useState } from 'react';
import { Smartphone, X, ChevronDown, ChevronUp, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';
import './styles.css';

interface InstallAppModalProps {
    onClose: () => void;
}

const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Fechar ao clicar fora
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="install-modal-overlay" onClick={handleOverlayClick}>
            <div className="install-modal-content">
                <button className="install-close-button" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="install-modal-header">
                    <Smartphone size={24} color="#1f2937" />
                    <h2 className="install-modal-title">Instalar nosso App</h2>
                </div>

                <p className="install-modal-description">
                    Tenha o nosso aplicativo na sua tela inicial para acessar de forma mais rápida e receber notificações exclusivas!
                </p>

                <div className="install-accordion">
                    {/* iOS Instructions */}
                    <div className="install-accordion-item">
                        <button
                            className="install-accordion-header"
                            onClick={() => toggleSection('ios')}
                        >
                            <span>Como instalar no iPhone (iOS)</span>
                            {expandedSection === 'ios' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedSection === 'ios' && (
                            <div className="install-accordion-body">
                                <ol className="step-list">
                                    <li>Toque no botão <strong>Compartilhar</strong> <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> na barra inferior do Safari.</li>
                                    <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />.</li>
                                    <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
                                </ol>
                            </div>
                        )}
                    </div>

                    {/* Android Instructions */}
                    <div className="install-accordion-item">
                        <button
                            className="install-accordion-header"
                            onClick={() => toggleSection('android')}
                        >
                            <span>Como instalar no Android</span>
                            {expandedSection === 'android' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedSection === 'android' && (
                            <div className="install-accordion-body">
                                <ol className="step-list">
                                    <li>Toque no ícone de menu (três pontos) <MoreVertical size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> do navegador (Chrome).</li>
                                    <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong> <Download size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />.</li>
                                    <li>Confirme tocando em <strong>Instalar</strong>.</li>
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstallAppModal;
