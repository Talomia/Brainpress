'use client';

import { useState, useEffect } from 'react';
import { bp_content, Post } from '@/lib/core/content';
import { bp_supabase } from '@/lib/supabase/client';

export default function ContentFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductionPosts = async () => {
    try {
      // 1. Fetch historical posts from Supabase production storage
      const { data, error } = await bp_supabase
        .from('bp_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // 2. Combine with any fresh in-memory posts from the current session
      const productionPosts = data || [];
      const sessionPosts = bp_content.getPosts();
      
      // Merge and remove duplicates by ID
      const allPosts = [...sessionPosts, ...productionPosts];
      const uniquePosts = Array.from(new Map(allPosts.map(item => [item.id, item])).values());
      
      setPosts(uniquePosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      console.error('[ContentFeed] Production sync failed:', e);
      // Fallback to in-memory only if production is unreachable
      setPosts([...bp_content.getPosts()].reverse());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionPosts();
    
    // Poll for real-time updates from both in-memory and production
    const interval = setInterval(fetchProductionPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>📝</span> Published Insights
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading && posts.length === 0 ? (
          <div className="skeleton" style={{ height: '100px', borderRadius: '16px' }}></div>
        ) : (
          <>
            {posts.length === 0 && (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No autonomous insights published yet. Start a chat to generate intelligence.</p>
            )}
            {posts.map((post) => (
              <div key={post.id} className="card glass fade-in" style={{ borderLeft: '4px solid var(--primary)', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>{post.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#555' }}>
                  <span style={{ fontWeight: 600 }}>Agent: {post.author_agent_id}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()} {new Date(post.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
