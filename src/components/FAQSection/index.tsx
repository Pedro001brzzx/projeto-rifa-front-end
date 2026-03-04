/**
 * Componente FAQ Section
 * View Layer - MVC Pattern
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import type { FAQ } from '../../models/types';

interface FAQSectionProps {
    faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-section">
            <div className="container">
                <div className="faq-header">
                    <HelpCircle size={20} className="faq-header-icon" />
                    <h2 className="faq-title">Perguntas frequentes</h2>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'faq-item--open' : ''}`}
                            onClick={() => toggleFaq(index)}
                        >
                            <div className="faq-question">
                                <span className="faq-question-text">{faq.question}</span>
                                <ChevronDown size={18} className="faq-chevron" />
                            </div>
                            <div className="faq-answer-wrapper">
                                <p className="faq-answer">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
