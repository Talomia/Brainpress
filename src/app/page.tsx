import { bp_plugins } from '@/lib/core/plugins';
import { SearchPlugin } from '@/lib/plugins/search-plugin';
import { runIntelligenceLoop } from '@/lib/core/loop';

export default async function Home() {
  // Initialize standard plugins
  await bp_plugins.register(SearchPlugin);

  // Example run (server-side for now)
  const result = await runIntelligenceLoop("How does Brainpress democratize intelligence?");

  return (
    <main className="container">
      <section className="hero">
        <h1>Brainpress</h1>
        <p>Democratizing the development of intelligence. Build, extend, and deploy AI agents with the ease of WordPress.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
          <a href="https://github.com/brainpress/core" className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Documentation</a>
        </div>
      </section>

      <section className="grid">
        <div className="card glass">
          <h3>The Intelligence Loop</h3>
          <p>The heart of Brainpress. A hook-driven reasoning engine that can be intercepted and extended.</p>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.9rem', color: '#ccc' }}>
            <strong>Latest Loop Execution:</strong>
            <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>"{result.messages[result.messages.length - 1].content}"</p>
          </div>
        </div>

        <div className="card glass">
          <h3>Plugin Architecture</h3>
          <p>Add memory, web search, or custom tools in seconds. Our hook system makes intelligence modular.</p>
          <ul style={{ marginTop: '1rem', listStyle: 'none', color: '#888' }}>
            <li style={{ marginBottom: '0.5rem' }}>✅ {SearchPlugin.name} (Active)</li>
            <li>⏳ Vector Memory (Available)</li>
          </ul>
        </div>

        <div className="card glass">
          <h3>Persona Themes</h3>
          <p>Switch between a helpful assistant, a rigorous researcher, or a creative writer with one click.</p>
        </div>
      </section>

      <footer style={{ marginTop: '8rem', textAlign: 'center', color: '#444', fontSize: '0.9rem' }}>
        <p>&copy; 2026 Brainpress Foundation. Built for the future of intelligence.</p>
      </footer>
    </main>
  );
}
