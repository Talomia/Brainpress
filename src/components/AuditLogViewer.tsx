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
        // Fallback to minimal system logs if Supabase fails
        setLogs([
          { id: 'err', created_at: new Date().toISOString(), input: 'System', output: 'Production logs temporarily unavailable. Verify Supabase connection.' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s for real-time audit
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem' }}>Production Audit Logs</h3>
        <button style={{ background: '#333', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px' }}>Export JSON</button>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Timestamp</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Query</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Intelligence Output</th>
            </tr>
          </thead>
          <tbody>
            {loading && logs.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center' }} className="skeleton">Syncing with Supabase...</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem', color: '#888', whiteSpace: 'nowrap' }}>{new Date(log.created_at).toLocaleTimeString()}</td>
                  <td style={{ padding: '1rem', color: '#0070f3', fontWeight: 600 }}>{log.input?.substring(0, 50)}...</td>
                  <td style={{ padding: '1rem', color: '#ccc' }}>{log.output?.substring(0, 120)}...</td>
                </tr>
              ))
            )}
            {!loading && logs.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#444' }}>No production logs found. Start a chat to generate data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
