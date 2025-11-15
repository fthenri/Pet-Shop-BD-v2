'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback(({ message, type = 'info', duration = 3000 }) => {
        setNotification({ message, type, duration, isActive: true });
    }, []);

    const showConfirmation = useCallback(({ message, onConfirm, onCancel }) => {
        setNotification({ 
            message, 
            type: 'confirm', 
            isActive: true, 
            onConfirm, 
            onCancel 
        });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(prev => ({ ...prev, isActive: false }));
        setTimeout(() => setNotification(null), 300); 
    }, []);

    const value = {
        notification,
        showNotification,
        showConfirmation,
        hideNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
    }
    return context;
};