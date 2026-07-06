'use client';

import { useState, useEffect } from 'react';
import { bp_plugins } from '@/lib/core/plugins';
import { bp_hooks } from '@/lib/core/hooks';
import { useNotifications } from '@/components/NotificationProvider';

export default function ThemeManager() {
  const [activePersona, setActivePersona] = useState('Research Scientist');
  const { showToast } = useNotifications();

  const personas = [
    { id: 'scientist', name: 'Research Scientist', icon: '🧬', description: 'Analytical, formal, and citation-heavy reasoning.' },
    { id: 'creative', name: 'Creative Muse', icon: '🎨', description: 'Expressive, metaphorical, and highly imaginative.' },
    { id: 'hacker', name: 'System Architect', icon: '💻', description: 'Technical, concise, and focused on code efficiency.' },
    { id: 'zen', name: 'Zen Master', icon: '🧘', description: 'Minimalist, calm, and focused on core essence.' }
  ];

  const applyPersona = (persona: any) => {
    setActivePersona(persona.name);
    // Logic to update the persona-theme plugin or global state
    showToast(`Intelligence persona switched to ${persona.name}`, 'info');
  };

  return (
    <div className="fade-in">
      <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Intelligence Personas</h3>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {personas.map((p) => (
          <div 
            key={p.id}
            onClick={() => applyPersona(p)}
            className="card glass hover-glow"
            style={{ 
              padding: '2rem', 
              cursor: 'pointer',
              border: activePersona === p.name ? '1px solid var(--primary)' : '1px solid #333',
              background: activePersona === p.name ? 'rgba(0, 112, 243, 0.05)' : 'rgba(255,255,255,0.02)',
              position: 'relative'
            }}
          >
            {activePersona === p.name && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>ACTIVE</div>
            )}
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{p.icon}</div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.name}</h4>
            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.5' }}>{p.description}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid #333' }}>
        <h4 style={{ marginBottom: '1rem' }}>Persona Hardening</h4>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Customize how the active persona intercepts reasoning filters.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: '#222', color: 'white', border: '1px solid #444', padding: '0.8rem 1.5rem', borderRadius: '8px' }}>Adjust Verbosity</button>
          <button style={{ background: '#222', color: 'white', border: '1px solid #444', padding: '0.8rem 1.5rem', borderRadius: '8px' }}>Tone Synthesis</button>
        </div>
      </div>
    </div>
  );
}
