'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { bp_hooks } from '@/lib/core/hooks';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  showToast: (message: string, type?: Toast['type']) => void;
  activePersona: string;
  setActivePersona: (name: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activePersona, setActivePersonaState] = useState('Research Scientist');

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const setActivePersona = useCallback((name: string) => {
    setActivePersonaState(name);
    
    // Dynamically update neural hooks based on persona
    if (name === 'System Architect') {
      bp_hooks.addHook('pre_process_input', {
        id: 'persona-interceptor',
        type: 'filter',
        priority: 10,
        callback: (input: string) => `[System Architect Mode] Optimize this architecture inquiry: ${input}`
      });
    } else if (name === 'Creative Muse') {
       bp_hooks.addHook('pre_process_input', {
        id: 'persona-interceptor',
        type: 'filter',
        priority: 10,
        callback: (input: string) => `[Creative Muse Mode] Imagine and expand upon: ${input}`
      });
    } else if (name === 'Zen Master') {
       bp_hooks.addHook('pre_process_input', {
        id: 'persona-interceptor',
        type: 'filter',
        priority: 10,
        callback: (input: string) => `[Zen Mode] Simplify to its core essence: ${input}`
      });
    } else {
      // Default: Research Scientist
      bp_hooks.addHook('pre_process_input', {
        id: 'persona-interceptor',
        type: 'filter',
        priority: 10,
        callback: (input: string) => `[Research Mode] Analyze rigorously: ${input}`
      });
    }
  }, []);

  const value = useMemo(() => ({ 
    showToast, 
    activePersona, 
    setActivePersona 
  }), [showToast, activePersona, setActivePersona]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="fade-in"
            style={{ 
              padding: '1rem 1.5rem', 
              borderRadius: '12px', 
              background: 'rgba(0,0,0,0.8)', 
              backdropFilter: 'blur(10px)',
              border: `1px solid ${toast.type === 'success' ? '#00ff00' : (toast.type === 'error' ? '#ff4444' : '#333')}`,
              color: 'white',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{toast.type === 'success' ? '✅' : (toast.type === 'error' ? '❌' : 'ℹ️')}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
