import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import { bp_supabase } from '../supabase/client';

export const LoggerPlugin: Plugin = {
  id: 'bp-logger',
  name: 'Intelligence Logger',
  version: '2.0.0',
  description: 'Synchronizes all intelligence loop activities with Supabase production audit logs.',
  init: () => {
    bp_hooks.addHook('loop_completed', {
      id: 'production-audit-sync',
      type: 'action',
      priority: 100,
      callback: async (state: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        const firstMsg = state.messages[0];

        console.log('[Logger] Synchronizing audit log with Supabase...');
        
        try {
          await bp_supabase.from('bp_loop_logs').insert([{
            session_id: state.sessionId,
            context_id: state.contextId,
            input: firstMsg.content,
            output: lastMsg.content,
            steps: state.steps,
            metadata: state.metadata,
            created_at: new Date().toISOString()
          }]);
        } catch (e) {
          console.warn('[Logger] Production sync failed:', e);
        }
      },
    });

    bp_hooks.addHook('pre_process_input', {
      id: 'log-input',
      type: 'filter',
      priority: 0,
      callback: (input: string) => {
        console.log('[BrainPress Log] Input Received:', input);
        return input;
      }
    });
  },
};
