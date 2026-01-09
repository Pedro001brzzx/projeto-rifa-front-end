/**
 * Componente FAQ Section
 * View Layer - MVC Pattern
 */

import React from 'react';
import type { FAQ } from '../../models/types';

interface FAQSectionProps {
    faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
    return (
        <div className="faq-section">
            <div className="container">

                {/* Cabeçalho do FAQ */}
                <div className="faq-header">
                    <h2 className="faq-title">🤷 Perguntas frequentes</h2>
                    <p className="faq-subtitle">Fale conosco</p>
                </div>

                {/* Lista de Perguntas */}
                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <details key={index} className="faq-item">
                            <summary className="faq-question">
                                {faq.question}
                                <span className="faq-icon">▼</span>
                            </summary>
                            <p className="faq-answer">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
