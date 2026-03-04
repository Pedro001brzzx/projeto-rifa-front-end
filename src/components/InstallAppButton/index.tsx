
import React, { useState } from 'react';
import { Smartphone, ArrowRight } from 'lucide-react';
import InstallAppModal from '../InstallAppModal';
import './styles.css';

const InstallAppButton: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="install-app-button" onClick={() => setShowModal(true)}>
                <div className="install-app-icon">
                    <Smartphone size={24} color="white" />
                </div>
                <div className="install-app-content">
                    <span className="install-app-title">Instalar o APP Grátis</span>
                    <span className="install-app-subtitle">Receba promoções exclusivas!</span>
                </div>
                <div className="install-app-arrow">
                    <ArrowRight size={20} color="white" />
                </div>
            </div>

            {showModal && <InstallAppModal onClose={() => setShowModal(false)} />}
        </>
    );
};

export default InstallAppButton;
