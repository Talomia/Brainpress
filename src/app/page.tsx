import { bp_plugins } from '@/lib/core/plugins';
import { SearchPlugin } from '@/lib/plugins/search-plugin';
import { runIntelligenceLoop } from '@/lib/core/loop';
import Link from 'next/link';

export default async function Home() {
  const greeting = "BrainPress Intelligence OS is live.";

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="hero fade-in">
        <h1>BrainPress</h1>
        <p>The next-generation autonomous intelligence operating system. Built with neural hooks and contextual reasoning.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <a href="https://github.com/Talomia/BrainPress" className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Documentation</a>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
        <div className="card glass">
          <h3>Neural Hooks</h3>
          <p>The heart of BrainPress. A hook-driven reasoning engine that can be intercepted and extended.</p>
        </div>
        <div className="card glass">
          <h3>Autonomous Loops</h3>
          <p>Self-correcting intelligence loops that utilize ReAct patterns for complex task execution.</p>
        </div>
        <div className="card glass">
          <h3>Contextual Personas</h3>
          <p>Switch between different specialized agent personas that dynamically adjust their reasoning style.</p>
        </div>
      </div>

      <footer style={{ marginTop: 'auto', padding: '4rem 0', textAlign: 'center', borderTop: '1px solid var(--card-border)', color: '#666' }}>
        <p>&copy; 2026 BrainPress Foundation. Built for the future of intelligence.</p>
      </footer>
    </main>
  );
}
