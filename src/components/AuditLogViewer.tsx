'use client';

import { useState, useEffect } from 'react';
import { bp_hooks } from '@/lib/core/hooks';

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // In a real scenario, this would poll the production-logging hooks or Supabase
    const mockLogs = [
      { id: 1, type: 'INFO', message: 'Intelligence loop initialized', timestamp: new Date().toISOString() },
      { id: 2, type: 'ACTION', message: 'Plugin [RAG] performed semantic search', timestamp: new Date().toISOString() },
      { id: 3, type: 'SUCCESS', message: 'Insight published to feed', timestamp: new Date().toISOString() },
    ];
    setLogs(mockLogs);
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem' }}>System Audit Logs</h3>
        <button style={{ background: '#333', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px' }}>Export CSV</button>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Timestamp</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem', color: '#888' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    background: log.type === 'SUCCESS' ? 'rgba(0,255,0,0.1)' : 'rgba(0,112,243,0.1)', 
                    color: log.type === 'SUCCESS' ? '#00ff00' : '#0070f3',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {log.type}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
