import React, { useState, useEffect, useRef } from 'react';
import './WhatsAppFloat.css';

const WhatsAppFloat: React.FC = () => {
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const floatRef = useRef<HTMLDivElement>(null);
    const hasMoved = useRef(false); // To distinguish click vs drag

    // WhatsApp Group Link (Placeholder)
    const whatsappLink = "https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE";

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        hasMoved.current = false;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
        hasMoved.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
            hasMoved.current = true;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (isDragging) {
            const touch = e.touches[0];
            const newX = touch.clientX - dragStart.x;
            const newY = touch.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
            hasMoved.current = true;
            e.preventDefault(); // Prevent scrolling while dragging
        }
    };

    const snapToCorner = () => {
        const { innerWidth, innerHeight } = window;
        const buttonSize = 60; // Approximate size including margin/padding if needed
        const padding = 20;

        // Define corners
        const corners = [
            { x: padding, y: padding }, // Top-Left
            { x: innerWidth - buttonSize - padding, y: padding }, // Top-Right
            { x: padding, y: innerHeight - buttonSize - padding }, // Bottom-Left
            { x: innerWidth - buttonSize - padding, y: innerHeight - buttonSize - padding } // Bottom-Right
        ];

        // Find nearest corner
        const currentX = position.x;
        const currentY = position.y;

        let nearestCorner = corners[0];
        let minDistance = Number.MAX_VALUE;

        corners.forEach(corner => {
            const distance = Math.sqrt(Math.pow(corner.x - currentX, 2) + Math.pow(corner.y - currentY, 2));
            if (distance < minDistance) {
                minDistance = distance;
                nearestCorner = corner;
            }
        });

        setPosition(nearestCorner);
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            snapToCorner();
        }
    };

    const handleClick = () => {
        if (!hasMoved.current) {
            window.open(whatsappLink, '_blank');
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={floatRef}
            className="whatsapp-float"
            style={{ left: `${position.x}px`, top: `${position.y}px`, bottom: 'auto', right: 'auto' }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            title="Fale conosco no WhatsApp"
        >
            <svg className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                {/* Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
        </div>
    );
};

export default WhatsAppFloat;
