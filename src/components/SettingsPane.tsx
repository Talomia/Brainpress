'use client';

import { useState, useEffect } from 'react';
import { bp_supabase } from '@/lib/supabase/client';
import { useNotifications } from '@/components/NotificationProvider';

export default function SettingsPane() {
  const [theme, setTheme] = useState('Nova Dark');
  const [autoPublish, setAutoPublish] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotifications();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await bp_supabase.from('user_settings').select('*').single();
        if (data) {
          setAutoPublish(data.auto_publish);
          setTheme(data.theme || 'Nova Dark');
        }
      } catch (e) {
        // Fallback for fresh production setup
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await bp_supabase.from('user_settings').upsert({
        id: 'global-config',
        auto_publish: autoPublish,
        theme: theme,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      showToast('Configuration synchronized with Supabase', 'success');
    } catch (e) {
      showToast('Persistence failed. Check network.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>System Governance</h2>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>Configure global intelligence policies and interface aesthetics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Neural Engine</h3>
            <div className="card glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
              <label style={{ display: 'block', color: '#666', marginBottom: '1rem', fontSize: '0.75rem', fontWeight: 900 }}>Primary Intelligence Bridge</label>
              <select style={{ 
                width: '100%', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid #222', 
                padding: '1rem', 
                borderRadius: '12px', 
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none'
              }}>
                <option>GPT-4o (Elite Reasoning)</option>
                <option>Gemini 1.5 Pro (Vision-Enabled)</option>
                <option>Local Llama 3 (Ollama / Offline)</option>
              </select>
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Autonomous Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ToggleSetting 
                label="Auto-Publish Insights" 
                description="Allow agents to publish reports directly to the feed."
                checked={autoPublish}
                onChange={() => setAutoPublish(!autoPublish)}
              />
              <ToggleSetting 
                label="Adaptive Self-Learning" 
                description="Enable weight refinement based on user corrections."
                checked={true}
                readOnly
              />
              <ToggleSetting 
                label="Recursive Tool Discovery" 
                description="Permit agents to spawn sub-tasks autonomously."
                checked={true}
                readOnly
              />
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <section>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Interface Identity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <ThemeCard name="Nova Dark" description="High-contrast neural aesthetic" active={theme === 'Nova Dark'} onClick={() => setTheme('Nova Dark')} color="#0070f3" />
              <ThemeCard name="Cyber Lime" description="Vibrant matrix-inspired interface" active={theme === 'Cyber Lime'} onClick={() => setTheme('Cyber Lime')} color="#00ff00" />
              <ThemeCard name="Glassmorphism" description="Ultra-premium frosted finish" active={theme === 'Glassmorphism'} onClick={() => setTheme('Glassmorphism')} color="#7928ca" />
            </div>
          </section>

          <div style={{ marginTop: 'auto' }}>
            <button 
              className="btn-primary hover-glow" 
              style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', borderRadius: '16px' }} 
              onClick={handleSave} 
              disabled={loading}
            >
              {loading ? 'Synchronizing Intelligence...' : 'Commit System Changes'}
            </button>
            <p style={{ textAlign: 'center', color: '#444', fontSize: '0.75rem', marginTop: '1rem' }}>Last synchronized: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, checked, onChange, readOnly }: any) {
  return (
    <div className="card glass hover-glow" style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 800, margin: 0, fontSize: '0.95rem' }}>{label}</p>
        <p style={{ color: '#555', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>{description}</p>
      </div>
      <div 
        onClick={!readOnly ? onChange : undefined}
        style={{ 
          width: '44px', 
          height: '24px', 
          background: checked ? '#0070f3' : '#222', 
          borderRadius: '12px', 
          position: 'relative', 
          cursor: readOnly ? 'default' : 'pointer',
          transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: readOnly ? 0.5 : 1
        }}
      >
        <div style={{ 
          width: '18px', 
          height: '18px', 
          background: '#fff', 
          borderRadius: '50%', 
          position: 'absolute', 
          top: '3px', 
          left: checked ? '23px' : '3px',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
        }}></div>
      </div>
    </div>
  );
}

function ThemeCard({ name, description, active, onClick, color }: any) {
  return (
    <div 
      onClick={onClick}
      className="card glass hover-glow"
      style={{ 
        padding: '1.2rem 1.5rem', 
        borderRadius: '16px', 
        border: `1px solid ${active ? color : 'transparent'}`,
        background: active ? `${color}08` : 'rgba(255,255,255,0.01)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1.2rem',
        transition: 'all 0.3s'
      }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `linear-gradient(135deg, ${color} 0%, #000 100%)`, border: '1px solid rgba(255,255,255,0.1)' }}></div>
      <div>
        <p style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: active ? '#fff' : '#888' }}>{name}</p>
        <p style={{ fontSize: '0.7rem', color: '#444', margin: 0 }}>{description}</p>
      </div>
      {active && (
        <div style={{ marginLeft: 'auto', color: color, fontSize: '0.8rem' }}>●</div>
      )}
    </div>
  );
}
