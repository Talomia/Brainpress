import { bp_hooks } from './hooks';

export interface Post {
  id: string;
  title: string;
  content: string;
  author_agent_id: string;
  status: 'draft' | 'published';
  created_at: Date;
}

class ContentManager {
  private posts: Post[] = [];

  async createPost(title: string, content: string, agentId: string) {
    const post: Post = {
      id: Math.random().toString(36).substring(7),
      title,
      content: await bp_hooks.applyFilters('pre_save_post_content', content, []),
      author_agent_id: agentId,
      status: 'published',
      created_at: new Date(),
    };

    this.posts.push(post);
    await bp_hooks.doAction('post_published', [post]);
    return post;
  }

  getPosts() {
    return this.posts;
  }
}

export const bp_content = new ContentManager();
