'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ContentFeed from '@/components/ContentFeed';
import SettingsPane from '@/components/SettingsPane';
import AuditLogViewer from '@/components/AuditLogViewer';
import ThemeManager from '@/components/ThemeManager';
import { bp_plugins } from '@/lib/core/plugins';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('agents');
  const [showChat, setShowChat] = useState(false);
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    setPlugins(bp_plugins.getAllPlugins());
    
    // Add a hook to update UI when a plugin is loaded
    const updatePlugins = () => setPlugins(bp_plugins.getAllPlugins());
    const interval = setInterval(updatePlugins, 500); // Faster polling for production "snap"
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(0, 112, 243, 0.05), transparent)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--card-border)', padding: '2rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '3rem', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Brainpress</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" icon="📊" />
          <SidebarItem active={activeTab === 'agents'} onClick={() => { setActiveTab('agents'); setShowChat(false); }} label="Agents" icon="🤖" />
          <SidebarItem active={activeTab === 'content'} onClick={() => { setActiveTab('content'); setShowChat(false); }} label="Content" icon="📝" />
          <SidebarItem active={activeTab === 'audit'} onClick={() => { setActiveTab('audit'); setShowChat(false); }} label="Audit Logs" icon="🛡️" />
          <SidebarItem active={activeTab === 'plugins'} onClick={() => { setActiveTab('plugins'); setShowChat(false); }} label="Plugins" icon="🔌" />
          <SidebarItem active={activeTab === 'themes'} onClick={() => { setActiveTab('themes'); setShowChat(false); }} label="Themes" icon="🎨" />
          <SidebarItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setShowChat(false); }} label="Settings" icon="⚙️" />
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{showChat ? 'Agent Laboratory' : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>Manage your autonomous intelligence ecosystem.</p>
          </div>
          {!showChat && (
            <button className="btn-primary" style={{ boxShadow: '0 0 20px rgba(0, 112, 243, 0.4)' }}>
              + Create New {activeTab === 'agents' ? 'Agent' : (activeTab === 'plugins' ? 'Plugin' : (activeTab === 'themes' ? 'Theme' : 'Asset'))}
            </button>
          )}
          {showChat && <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #333' }} onClick={() => setShowChat(false)}>Back to Agents</button>}
        </header>

        {showChat ? (
          <ChatInterface />
        ) : (
          <div className="fade-in">
            {activeTab === 'dashboard' && <DashboardStats plugins={plugins} />}
            
            {activeTab === 'content' && (
              <ContentFeed />
            )}

            {activeTab === 'settings' && (
              <SettingsPane />
            )}

            {activeTab === 'audit' && (
              <AuditLogViewer />
            )}

            {activeTab === 'themes' && (
              <ThemeManager />
            )}

            {activeTab === 'agents' && (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                <AgentCard name="Research Pro" status="Active" description="A highly analytical agent focused on academic search." onChat={() => setShowChat(true)} />
                <AgentCard name="Creative Muse" status="Standby" description="Specialized in narrative generation and poetry." onChat={() => setShowChat(true)} />
                <AgentCard name="Code Whisperer" status="Active" description="Optimized for TypeScript and System Architecture." onChat={() => setShowChat(true)} />
              </div>
            )}

            {activeTab === 'plugins' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {plugins.length === 0 && <p style={{ color: '#666' }}>No plugins registered in the neural hook system.</p>}
                {plugins.map((p) => (
                  <div key={p.id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{p.name}</h3>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>{p.id} • v{p.version}</p>
                      <p style={{ color: '#888', marginTop: '0.5rem', fontSize: '0.85rem' }}>{p.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <span style={{ color: '#00ff00', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff00' }}></span>
                        Active
                      </span>
                      <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Settings</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function SidebarItem({ active, onClick, label, icon }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '0.8rem 1.2rem', 
        borderRadius: '12px', 
        cursor: 'pointer',
        background: active ? 'rgba(0, 112, 243, 0.15)' : 'transparent',
        color: active ? '#fff' : '#888',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: active ? 'translateX(5px)' : 'none'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      <span style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
    </div>
  );
}

function DashboardStats({ plugins }: any) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
      <StatCard label="Total Intelligence Capacity" value="1.2 TFLOPs" delta="+12%" />
      <StatCard label="Active Reasoning Loops" value="24/7" delta="Stable" />
      <StatCard label="Plugins Registered" value={plugins.length.toString()} delta="Live" />
    </div>
  );
}

function StatCard({ label, value, delta }: any) {
  return (
    <div className="card glass" style={{ padding: '2rem' }}>
      <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{value}</h2>
        <span style={{ color: '#00ff00', fontSize: '0.8rem', fontWeight: 600 }}>{delta}</span>
      </div>
    </div>
  );
}

function AgentCard({ name, status, description, onChat }: any) {
  return (
    <div className="card glass hover-glow" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: status === 'Active' ? 'var(--primary)' : '#444' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{name}</h3>
        <span style={{ 
          fontSize: '0.7rem', 
          background: status === 'Active' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,0,0.1)', 
          color: status === 'Active' ? '#00ff00' : '#ffff00', 
          padding: '0.3rem 0.8rem', 
          borderRadius: '20px',
          fontWeight: 600,
          border: `1px solid ${status === 'Active' ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,0,0.2)'}`
        }}>{status}</span>
      </div>
      <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>{description}</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: 'white', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>Configure</button>
        <button className="btn-primary" style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }} onClick={onChat}>Launch Chat</button>
      </div>
    </div>
  );
}
