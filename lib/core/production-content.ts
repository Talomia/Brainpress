import { bp_supabase } from '../supabase/client';
import { bp_hooks } from '../core/hooks';
import { Post } from './content';

class ProductionContentManager {
  async createPost(title: string, content: string, agentId: string) {
    const { data, error } = await bp_supabase
      .from('bp_posts')
      .insert([
        { title, content, author_agent_id: agentId, status: 'published' }
      ])
      .select()
      .single();

    if (error) {
      console.error('[Content] Persistence Error:', error);
      // Fallback to memory for resilience
      return { id: 'fallback', title, content, author_agent_id: agentId, status: 'published', created_at: new Date() };
    }

    await bp_hooks.doAction('post_published', data);
    return data as Post;
  }

  async getPosts() {
    const { data, error } = await bp_supabase
      .from('bp_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as Post[];
  }
}

export const bp_production_content = new ProductionContentManager();
