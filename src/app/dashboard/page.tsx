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

  // Optimized Sync: Only update when necessary, and use a longer interval to prevent lag
  useEffect(() => {
    const syncPlugins = () => {
      const currentPlugins = bp_plugins.getAllPlugins();
      setPlugins(currentPlugins);
    };
    
    syncPlugins();
    const interval = setInterval(syncPlugins, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleLaunchAgent = (id: string) => {
    setActiveAgent(id);
    setShowChat(true);
  };

  return (
    <div className="dashboard-container" style={{ 
      display: 'flex', 
      minHeight: '100vh',
      flexDirection: 'row',
      background: 'var(--background)',
      overflow: 'hidden' 
    }}>
      {/* Sidebar - Hardened Responsiveness */}
      <aside style={{ 
        width: '280px', 
        minWidth: '280px',
        borderRight: '1px solid var(--card-border)', 
        padding: '2rem', 
        background: 'rgba(0,0,0,0.6)', 
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          marginBottom: '3rem', 
          background: 'linear-gradient(to right, #fff, #888)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>BrainPress</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <SidebarItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setShowChat(false); }} label="Dashboard" icon="📊" />
          <SidebarItem active={activeTab === 'agents'} onClick={() => { setActiveTab('agents'); setShowChat(false); }} label="Agent Gallery" icon="🤖" />
          <SidebarItem active={activeTab === 'content'} onClick={() => { setActiveTab('content'); setShowChat(false); }} label="Content" icon="📝" />
          <SidebarItem active={activeTab === 'audit'} onClick={() => { setActiveTab('audit'); setShowChat(false); }} label="Audit Logs" icon="🛡️" />
          <SidebarItem active={activeTab === 'plugins'} onClick={() => { setActiveTab('plugins'); setShowChat(false); }} label="Plugins" icon="🔌" />
          <SidebarItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setShowChat(false); }} label="Settings" icon="⚙️" />
        </nav>

        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid #222' }}>
          <p style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', fontWeight: 700 }}>Active Persona</p>
          <p style={{ fontSize: '0.9rem', color: activeAgent.styles.accentColor, fontWeight: 600 }}>{activeAgent.name}</p>
        </div>
      </aside>

      {/* Main Content - Robust Scrolling & Layout */}
      <main style={{ 
        flex: 1, 
        padding: '3rem', 
        overflowY: 'auto', 
        position: 'relative',
        background: `radial-gradient(circle at 50% 0%, ${activeAgent.styles.glowColor.replace('0.4', '0.05')}, transparent 70%)`
      }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '3.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'transparent',
          backdropFilter: 'blur(5px)'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              {showChat ? activeAgent.name : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('agents', 'Agent Gallery'))}
            </h1>
            <p style={{ color: '#666', marginTop: '0.2rem', fontSize: '0.95rem' }}>
              {showChat ? `Laboratory Session • ${activeAgent.name}` : 'Neural Hook Intelligence OS'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {showChat && (
              <button 
                className="btn-primary" 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#fff' }} 
                onClick={() => setShowChat(false)}
              >
                Close Lab
              </button>
            )}
            {!showChat && activeTab === 'agents' && (
              <button className="btn-primary" style={{ boxShadow: `0 0 20px ${activeAgent.styles.glowColor}` }}>
                + Build Agent
              </button>
            )}
          </div>
        </header>

        <div className="fade-in" style={{ paddingBottom: '4rem' }}>
          {showChat ? (
             <ChatInterface />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardStats plugins={plugins} activeAgent={activeAgent} />}
              
              {activeTab === 'content' && <ContentFeed />}

              {activeTab === 'settings' && <SettingsPane />}

              {activeTab === 'audit' && <AuditLogViewer />}

              {activeTab === 'agents' && (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {plugins.map((p) => (
                    <div key={p.id} className="card glass" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '1.2rem 2rem',
                      borderLeft: `3px solid ${activeAgent.styles.accentColor}` 
                    }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{p.name}</h3>
                        <p style={{ color: '#555', fontSize: '0.8rem', margin: 0 }}>ID: {p.id} • Version {p.version}</p>
                      </div>
                      <span style={{ 
                        color: '#00ff00', 
                        fontSize: '0.75rem', 
                        background: 'rgba(0,255,0,0.05)', 
                        padding: '0.3rem 0.8rem', 
                        borderRadius: '20px',
                        border: '1px solid rgba(0,255,0,0.1)',
                        fontWeight: 700
                      }}>
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ active, onClick, label, icon }: any) {
  return (
    <div 
      onClick={onClick} 
      style={{ 
        padding: '0.9rem 1.2rem', 
        borderRadius: '10px', 
        cursor: 'pointer', 
        background: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent', 
        border: active ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
        color: active ? '#fff' : '#666', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fontWeight: active ? 700 : 500
      }}
    >
      <span style={{ fontSize: '1.2rem', opacity: active ? 1 : 0.5 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function DashboardStats({ plugins, activeAgent }: any) {
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
      <StatCard label="Intelligence Capacity" value="1.2 TFLOPs" delta="+12%" color="#0070f3" />
      <StatCard label="Active Reasoning" value={activeAgent.name} delta="Sync" color={activeAgent.styles.accentColor} />
      <StatCard label="Live Plugins" value={plugins.length.toString()} delta="Active" color="#7928ca" />
    </div>
  );
}

function StatCard({ label, value, delta, color }: any) {
  return (
    <div className="card glass" style={{ padding: '2rem', borderTop: `4px solid ${color}` }}>
      <p style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: '1rem' }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>{value}</h2>
        <span style={{ color: '#00ff00', fontSize: '0.8rem', fontWeight: 700, background: 'rgba(0,255,0,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{delta}</span>
      </div>
    </div>
  );
}

function AgentCard({ agent, isActive, onLaunch }: { agent: AgentPersona, isActive: boolean, onLaunch: () => void }) {
  return (
    <div className="card glass hover-glow" style={{ 
      padding: '2.2rem', 
      position: 'relative', 
      border: isActive ? `1px solid ${agent.styles.accentColor}` : '1px solid var(--card-border)',
      background: isActive ? 'rgba(255,255,255,0.02)' : 'var(--card-bg)'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '5px', 
        height: '100%', 
        background: agent.styles.accentColor,
        boxShadow: `0 0 15px ${agent.styles.glowColor}` 
      }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{agent.icon} {agent.name}</h3>
        {isActive && (
          <span style={{ 
            fontSize: '0.6rem', 
            background: agent.styles.accentColor, 
            color: '#000', 
            padding: '0.25rem 0.6rem', 
            borderRadius: '4px', 
            fontWeight: 900,
            letterSpacing: '0.5px' 
          }}>ACTIVE</span>
        )}
      </div>
      <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '2.5rem', minHeight: '4.5rem' }}>{agent.description}</p>
      <button 
        className="btn-primary" 
        style={{ 
          width: '100%', 
          padding: '1rem', 
          borderRadius: '12px', 
          background: isActive ? agent.styles.accentColor : 'rgba(255,255,255,0.05)',
          color: isActive ? '#000' : '#fff',
          fontWeight: 700,
          border: isActive ? 'none' : '1px solid #333'
        }} 
        onClick={onLaunch}
      >
        {isActive ? 'Resume Session' : 'Initialize Agent'}
      </button>
    </div>
  );
}
