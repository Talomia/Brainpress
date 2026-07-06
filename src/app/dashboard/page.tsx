'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ContentFeed from '@/components/ContentFeed';
import SettingsPane from '@/components/SettingsPane';
import AuditLogViewer from '@/components/AuditLogViewer';
import { bp_plugins } from '@/lib/core/plugins';
import { bp_agents, AgentPersona } from '@/lib/core/agents';
import { useNotifications } from '@/components/NotificationProvider';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('agents');
  const [showChat, setShowChat] = useState(false);
  const [plugins, setPlugins] = useState<any[]>([]);
  const { activeAgent, setActiveAgent } = useNotifications();

  useEffect(() => {
    setPlugins(bp_plugins.getAllPlugins());
    const interval = setInterval(() => setPlugins(bp_plugins.getAllPlugins()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchAgent = (id: string) => {
    setActiveAgent(id);
    setShowChat(true);
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--card-border)', padding: '2rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '3rem', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Brainpress</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" icon="📊" />
          <SidebarItem active={activeTab === 'agents'} onClick={() => { setActiveTab('agents'); setShowChat(false); }} label="Agent Gallery" icon="🤖" />
          <SidebarItem active={activeTab === 'content'} onClick={() => { setActiveTab('content'); setShowChat(false); }} label="Content" icon="📝" />
          <SidebarItem active={activeTab === 'audit'} onClick={() => { setActiveTab('audit'); setShowChat(false); }} label="Audit Logs" icon="🛡️" />
          <SidebarItem active={activeTab === 'plugins'} onClick={() => { setActiveTab('plugins'); setShowChat(false); }} label="Plugins" icon="🔌" />
          <SidebarItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setShowChat(false); }} label="Settings" icon="⚙️" />
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{showChat ? activeAgent.name : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>{showChat ? `Operating as ${activeAgent.name}` : 'Manage your autonomous intelligence ecosystem.'}</p>
          </div>
          {!showChat && (
            <button className="btn-primary" style={{ boxShadow: `0 0 20px ${activeAgent.styles.glowColor}` }}>
              + Create New {activeTab === 'agents' ? 'Agent' : 'Asset'}
            </button>
          )}
          {showChat && <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #333' }} onClick={() => setShowChat(false)}>Exit Laboratory</button>}
        </header>

        {showChat ? (
          <div className="fade-in">
             <ChatInterface />
          </div>
        ) : (
          <div className="fade-in">
            {activeTab === 'dashboard' && <DashboardStats plugins={plugins} activeAgent={activeAgent} />}
            
            {activeTab === 'content' && <ContentFeed />}

            {activeTab === 'settings' && <SettingsPane />}

            {activeTab === 'audit' && <AuditLogViewer />}

            {activeTab === 'agents' && (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {bp_agents.getAllAgents().map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    isActive={activeAgent.id === agent.id}
                    onLaunch={() => handleLaunchAgent(agent.id)} 
                  />
                ))}
              </div>
            )}

            {activeTab === 'plugins' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {plugins.map((p) => (
                  <div key={p.id} className="card glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{p.name}</h3>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>{p.id} • v{p.version}</p>
                    </div>
                    <span style={{ color: '#00ff00', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff00' }}></span>
                      Active
                    </span>
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
    <div onClick={onClick} style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', cursor: 'pointer', background: active ? 'rgba(0, 112, 243, 0.15)' : 'transparent', color: active ? '#fff' : '#888', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s' }}>
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      <span style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
    </div>
  );
}

function DashboardStats({ plugins, activeAgent }: any) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
      <StatCard label="Total Capacity" value="1.2 TFLOPs" delta="+12%" />
      <StatCard label="Active Agent" value={activeAgent.name} delta="Synchronized" />
      <StatCard label="Plugins" value={plugins.length.toString()} delta="Live" />
    </div>
  );
}

function StatCard({ label, value, delta }: any) {
  return (
    <div className="card glass" style={{ padding: '2rem' }}>
      <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{value}</h2>
        <span style={{ color: '#00ff00', fontSize: '0.8rem', fontWeight: 600 }}>{delta}</span>
      </div>
    </div>
  );
}

function AgentCard({ agent, isActive, onLaunch }: { agent: AgentPersona, isActive: boolean, onLaunch: () => void }) {
  return (
    <div className="card glass hover-glow" style={{ padding: '2rem', position: 'relative', border: isActive ? `1px solid ${agent.styles.accentColor}` : '1px solid var(--card-border)' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: agent.styles.accentColor }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{agent.icon} {agent.name}</h3>
        {isActive && <span style={{ fontSize: '0.6rem', background: agent.styles.accentColor, color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 900 }}>ACTIVE</span>}
      </div>
      <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem', minHeight: '4.5rem' }}>{agent.description}</p>
      <button className="btn-primary" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', background: isActive ? agent.styles.accentColor : 'rgba(255,255,255,0.05)' }} onClick={onLaunch}>
        {isActive ? 'Continue Laboratory' : 'Initialize Persona'}
      </button>
    </div>
  );
}
