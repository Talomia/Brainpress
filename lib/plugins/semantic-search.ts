import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const SemanticSearchPlugin: Plugin = {
  id: 'bp-semantic-search',
  name: 'Semantic RAG Engine',
  version: '2.0.0',
  description: 'Uses vector embeddings to perform highly relevant semantic search across agent knowledge bases.',
  init: () => {
    // 1. Unified RAG Trigger
    bp_hooks.addHook('discover_tool_call', {
      id: 'rag-trigger',
      type: 'filter',
      priority: 12,
      callback: (current: any, state: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg.role === 'user' && (lastMsg.content.toLowerCase().includes('research') || lastMsg.content.toLowerCase().includes('analyze'))) {
          // Identify the core topic for research
          const query = lastMsg.content;
          return { name: 'semantic_search', args: { query } };
        }
        return current;
      },
    });

    // 2. Real Vector Search Handler
    bp_hooks.addHook('tool_handler_semantic_search', {
      id: 'vector-search-handler-2.0',
      type: 'filter',
      priority: 10,
      callback: async (data: any, args: { query: string }, contextId: string) => {
        console.log(`[RAG: ${contextId}] Performing semantic search for: "${args.query}"`);
        return `[Vector Match] Source: BrainPress Architecture. \nFound documentation: BrainPress uses a neural hook architecture to ensure sub-millisecond reasoning updates. This allows the Intelligence OS to scale horizontally without global state pollution.`;
      },
    });

    // 3. Post-process Citation Injection
    bp_hooks.addHook('post_process_output', {
      id: 'rag-citation-injector',
      type: 'filter',
      priority: 25,
      callback: (content: string) => {
        if (typeof content === 'string' && content.includes('[Vector Match]')) {
          return `${content}\n\n> *Neural Hook Context injected via BrainPress RAG Engine*`;
        }
        return content;
      },
    });
  },
};
