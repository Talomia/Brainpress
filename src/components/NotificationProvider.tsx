'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { bp_agents, AgentPersona } from '@/lib/core/agents';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationContextType {
  showToast: (message: string, type?: Toast['type']) => void;
  activeAgent: AgentPersona;
  setActiveAgent: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeAgent, setActiveAgentState] = useState<AgentPersona>(bp_agents.getActiveAgent()!);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const setActiveAgent = useCallback(async (id: string) => {
    try {
      await bp_agents.activateAgent(id);
      const agent = bp_agents.getAgent(id);
      if (agent) {
        setActiveAgentState(agent);
        showToast(`Agent synchronized: ${agent.name}`, 'success');
      }
    } catch (e) {
      showToast('Failed to switch agent persona', 'error');
    }
  }, [showToast]);

  // Initial activation
  useEffect(() => {
    bp_agents.activateAgent('researcher');
  }, []);

  const value = useMemo(() => ({ 
    showToast, 
    activeAgent, 
    setActiveAgent 
  }), [showToast, activeAgent, setActiveAgent]);

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
