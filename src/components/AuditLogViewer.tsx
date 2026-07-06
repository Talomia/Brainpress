'use client';

import { useState, useEffect } from 'react';
import { bp_supabase } from '@/lib/supabase/client';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await bp_supabase
          .from('bp_loop_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        setLogs(data || []);
      } catch (e) {
        console.error('[AuditLogViewer] Failed to fetch production logs:', e);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>Intelligence Audit</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Traceable neural synthesis history</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button style={{ background: 'rgba(255,255,255,0.03)', color: '#aaa', border: '1px solid #222', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Filter Events</button>
          <button style={{ background: '#fff', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>Export Logs</button>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '120px 1fr 2fr', gap: '2rem', fontSize: '0.7rem', fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <div>Timestamp</div>
          <div>Neural Query</div>
          <div>Synthesized Insight</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading && logs.length === 0 ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '70px', margin: '1rem 2rem', borderRadius: '12px' }}></div>
            ))
          ) : (
            <>
              {logs.length === 0 && (
                <div style={{ padding: '5rem', textAlign: 'center', color: '#333' }}>
                  <p style={{ fontSize: '1rem', fontStyle: 'italic' }}>No production activity recorded.</p>
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="hover-glow" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '120px 1fr 2fr', 
                  gap: '2rem', 
                  padding: '1.5rem 2rem', 
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  alignItems: 'center',
                  transition: 'background 0.2s ease'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                  <div style={{ fontSize: '0.85rem', color: '#0070f3', fontWeight: 700, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.input}</div>
                  <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{log.output}</div>
                </div>
              ))
            )}
          </>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0070f3' }}></div>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#222' }}></div>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#222' }}></div>
      </div>
    </div>
  );
}
