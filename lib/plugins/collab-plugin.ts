import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import { bp_supabase } from '../supabase/client';

export const MultiAgentCollabPlugin: Plugin = {
  id: 'bp-multi-agent-collab',
  name: 'Multi-Agent Collaboration',
  version: '2.0.0',
  description: 'Enables multiple agents to collaborate through a persistent, Supabase-backed shared intelligence workspace.',
  init: () => {
    // BrainPress 2.0: Persistent Collaborative Workspace
    
    bp_hooks.addHook('after_tool_call', {
      id: 'shared-workspace-persist',
      type: 'action',
      priority: 15,
      callback: async ({ state, toolResult }: any, contextId: string) => {
        console.log(`[Collab: ${contextId}] Persisting insight from ${toolResult.tool}`);
        
        try {
          await bp_supabase.from('bp_collab_workspace').insert([{
            context_id: contextId,
            session_id: state.sessionId,
            source_agent: toolResult.tool,
            insight: typeof toolResult.result === 'string' ? toolResult.result : JSON.stringify(toolResult.result),
            step_index: state.steps,
            created_at: new Date().toISOString()
          }]);
        } catch (e) {
          console.warn('[Collab] Persistence failed:', e);
        }
      },
    });

    bp_hooks.addHook('reasoning_engine', {
      id: 'collab-context-injection-2.0',
      type: 'filter',
      priority: 5,
      callback: async (content: string, { state }: any, contextId: string) => {
        try {
          // Fetch the latest 5 collaborative insights for this context
          const { data } = await bp_supabase
            .from('bp_collab_workspace')
            .select('source_agent, insight')
            .eq('context_id', contextId)
            .order('created_at', { ascending: false })
            .limit(5);

          if (data && data.length > 0) {
            const collabContext = data.map(w => `[Agent ${w.source_agent}]: ${w.insight}`).reverse().join('\n');
            console.log(`[Collab: ${contextId}] Injected ${data.length} insights into reasoning.`);
            return `[Collaborative Workspace Context]\n${collabContext}\n\n${content}`;
          }
        } catch (e) {
          console.warn('[Collab] Context injection failed:', e);
        }
        return content;
      },
    });
  },
};
