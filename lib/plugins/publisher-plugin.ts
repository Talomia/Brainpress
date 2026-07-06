import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import { bp_content } from '../core/content';

export const AutoPublisherPlugin: Plugin = {
  id: 'bp-autopublisher',
  name: 'Autonomous Content Publisher',
  version: '1.0.0',
  description: 'Automatically intercepts agent insights and publishes them to the content feed.',
  init: () => {
    bp_hooks.addHook('loop_completed', {
      id: 'publish-insight',
      type: 'action',
      priority: 200,
      callback: async (state: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        const initialUserMsg = state.messages[0].content.toLowerCase();
        const reasoningContent = lastMsg?.content?.toLowerCase() || '';
        
        // QUALITY CHECK: Do not publish if there was an error or empty content
        if (!lastMsg || lastMsg.role !== 'assistant' || lastMsg.content.includes('[Error]') || lastMsg.content.includes('[Gemini Error]')) {
          console.warn('[AutoPublisher] Insight rejected due to quality check failure (Error detected).');
          return;
        }

        const isPublishRequested = initialUserMsg.includes('publish') || initialUserMsg.includes('report') || reasoningContent.includes('publish');

        if (isPublishRequested) {
          const { bp_production_content } = require('../core/production-content');
          console.log('[AutoPublisher] Insight passed quality check. Publishing to feed...');
          const postTitle = `Autonomous Insight: ${state.messages[0].content.substring(0, 30)}...`;
          const postContent = lastMsg.content;
          const agentId = 'research-pro';

          // Ensure it appears in UI via in-memory manager
          await bp_content.createPost(postTitle, postContent, agentId);
          console.log('[AutoPublisher] Content feed updated. Total posts:', bp_content.getPosts().length);

          // Attempt production persistence
          await bp_production_content.createPost(postTitle, postContent, agentId);
        }
      },
    });
  },
};
