'use client';

import { useState, useEffect } from 'react';
import { bp_content, Post } from '@/lib/core/content';

export default function ContentFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Poll for new posts (simulating a real-time reactive feed)
    const interval = setInterval(() => {
      setPosts([...bp_content.getPosts()].reverse());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>📝</span> Published Insights
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.length === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No autonomous insights published yet...</p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="card glass" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{post.title}</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>{post.content.substring(0, 200)}...</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666' }}>
              <span>Agent: {post.author_agent_id}</span>
              <span>{new Date(post.created_at).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
