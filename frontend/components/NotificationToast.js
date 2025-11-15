'use client';

import { useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext'; 
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaQuestionCircle, FaTimes } from 'react-icons/fa';

export default function NotificationToast() {
    const { notification, hideNotification } = useNotification();

    useEffect(() => {
        if (notification && notification.isActive && notification.type !== 'confirm') {
            const timer = setTimeout(hideNotification, notification.duration);
            return () => clearTimeout(timer);
        }
    }, [notification, hideNotification]);

    if (!notification || !notification.isActive) {
        return null;
    }

    let icon, iconColor, boxShadow;
    switch (notification.type) {
        case 'success':
            icon = <FaCheck />;
            iconColor = '#28a745'; 
            boxShadow = '0 5px 15px rgba(40, 167, 69, 0.4)';
            break;
        case 'error':
            icon = <FaExclamationTriangle />;
            iconColor = '#dc3545';
            boxShadow = '0 5px 15px rgba(220, 53, 69, 0.4)';
            break;
        case 'confirm':
            icon = <FaQuestionCircle />;
            iconColor = '#ffc107'; // 
            boxShadow = '0 5px 15px rgba(255, 193, 7, 0.4)';
            break;
        case 'info':
        default:
            icon = <FaInfoCircle />;
            iconColor = '#007bff'; // Azul Primário
            boxShadow = '0 5px 15px rgba(0, 123, 255, 0.4)';
            break;
    }

    const toastStyle = {
        position: 'fixed',
        bottom: notification.type === 'confirm' ? '50%' : '20px', 
        right: '20px',
        maxWidth: notification.type === 'confirm' ? '500px' : '400px',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: 'var(--content-bg)',
        color: 'var(--text-color)',
        boxShadow: boxShadow,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        animation: 'slideIn 0.3s ease-out',
        border: `1px solid ${iconColor}`,
    };

    const confirmButtonStyle = {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        marginLeft: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    };
    
    const cancelButtonStyle = {
        backgroundColor: 'var(--text-color-muted)',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
    };


    return (
        <div style={toastStyle} className="notification-toast">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div style={{ color: iconColor, fontSize: '1.5rem', lineHeight: '1' }}>{icon}</div>
                <p style={{ margin: 0, fontWeight: 500, flexGrow: 1 }}>{notification.message}</p>
                {notification.type !== 'confirm' && (
                    <button 
                        onClick={hideNotification} 
                        style={{ background: 'none', border: 'none', color: 'var(--text-color-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: 0 }}
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
            
            {notification.type === 'confirm' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button style={cancelButtonStyle} onClick={hideNotification}>
                        Cancelar
                    </button>
                    <button style={confirmButtonStyle} onClick={notification.onConfirm}>
                        Confirmar
                    </button>
                </div>
            )}
        </div>
    );
}