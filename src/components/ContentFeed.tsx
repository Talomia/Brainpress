'use client';

import { useState, useEffect } from 'react';
import { bp_content, Post } from '@/lib/core/content';
import { bp_supabase } from '@/lib/supabase/client';
import { useNotifications } from './NotificationProvider';

export default function ContentFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeAgent } = useNotifications();

  const fetchProductionPosts = async () => {
    try {
      const { data, error } = await bp_supabase
        .from('bp_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      const productionPosts = data || [];
      const sessionPosts = bp_content.getPosts();
      
      const allPosts = [...sessionPosts, ...productionPosts];
      const uniquePosts = Array.from(new Map(allPosts.map(item => [item.id, item])).values());
      
      setPosts(uniquePosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (e) {
      setPosts([...bp_content.getPosts()].reverse());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionPosts();
    const interval = setInterval(fetchProductionPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>Published Insights</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Real-time autonomous intelligence feed</p>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px', 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          border: '1px solid #222',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff00', boxShadow: '0 0 10px #00ff00' }}></span>
          LIVE FEED
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
        {loading && posts.length === 0 ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '24px' }}></div>
          ))
        ) : (
          <>
            {posts.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed #222' }}>
                <p style={{ color: '#444', fontStyle: 'italic', fontSize: '1.1rem' }}>No autonomous insights published yet.</p>
                <p style={{ color: '#333', fontSize: '0.85rem', marginTop: '0.5rem' }}>Start a chat with an agent to generate intelligence.</p>
              </div>
            )}
            {posts.map((post) => (
              <div key={post.id} className="card glass hover-glow fade-in" style={{ 
                padding: '2rem', 
                display: 'flex', 
                flexDirection: 'column',
                borderLeft: `1px solid ${activeAgent.styles.accentColor}33`,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'flex-start' }}>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 900, 
                    color: activeAgent.styles.accentColor, 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px',
                    background: `${activeAgent.styles.accentColor}11`,
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px'
                  }}>
                    {post.author_agent_id}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#444', fontWeight: 600 }}>
                    {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.3' }}>{post.title}</h3>
                <p style={{ 
                  color: '#aaa', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.7', 
                  marginBottom: '2rem', 
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>{post.content}</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingTop: '1.2rem',
                  borderTop: '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>VERIFY</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>SHARE</button>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#444' }}>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
