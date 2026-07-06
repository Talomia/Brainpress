'use client';

import { useState, useEffect } from 'react';
import { bp_supabase } from '@/lib/supabase/client';
import { useNotifications } from '@/components/NotificationProvider';

export default function SettingsPane() {
  const [apiKey, setApiKey] = useState('************************');
  const [theme, setTheme] = useState('Nova Dark');
  const [autoPublish, setAutoPublish] = useState(true);
  const { showToast } = useNotifications();

  const handleSave = async () => {
    showToast('Settings saved to cloud', 'success');
    // Logic to persist to Supabase user_settings table
  };

  return (
    <div className="fade-in" style={{ maxWidth: '800px' }}>
      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Core Intelligence</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="setting-item">
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Gemini API Key</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', padding: '0.8rem', borderRadius: '8px', color: 'white' }}
            />
          </div>
          <div className="setting-item">
            <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Primary LLM Model</label>
            <select style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', padding: '0.8rem', borderRadius: '8px', color: 'white' }}>
              <option>Gemini 1.5 Pro</option>
              <option>Gemini 1.5 Flash</option>
              <option>Local Llama 3 (Ollama)</option>
            </select>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Autonomous Governance</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600 }}>Auto-Publish Insights</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>Allow agents to publish reports directly to the feed.</p>
            </div>
            <input type="checkbox" checked={autoPublish} onChange={() => setAutoPublish(!autoPublish)} style={{ width: '20px', height: '20px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600 }}>Adaptive Learning</p>
              <p style={{ color: '#666', fontSize: '0.85rem' }}>Enable agents to refine their weights based on your corrections.</p>
            </div>
            <input type="checkbox" checked={true} readOnly style={{ width: '20px', height: '20px' }} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Interface Persona</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <ThemeCard name="Nova Dark" active={theme === 'Nova Dark'} onClick={() => setTheme('Nova Dark')} />
          <ThemeCard name="Cyber Lime" active={theme === 'Cyber Lime'} onClick={() => setTheme('Cyber Lime')} />
          <ThemeCard name="Glassmorphism" active={theme === 'Glassmorphism'} onClick={() => setTheme('Glassmorphism')} />
        </div>
      </section>

      <button className="btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={handleSave}>Save Configuration</button>
    </div>
  );
}

function ThemeCard({ name, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '1.5rem', 
        borderRadius: '12px', 
        border: `2px solid ${active ? 'var(--primary)' : '#333'}`,
        background: active ? 'rgba(0, 112, 243, 0.1)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.3s'
      }}
    >
      <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{name}</p>
    </div>
  );
}
