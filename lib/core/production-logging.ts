import { bp_supabase } from '../supabase/client';
import { bp_hooks } from '../core/hooks';

export async function logLoopToProduction(state: any) {
  const { error } = await bp_supabase
    .from('bp_loop_logs')
    .insert([
      { 
        input: state.messages[0].content,
        output: state.messages[state.messages.length - 1].content,
        metadata: state.metadata
      }
    ]);

  if (error) console.error('[Logging] Production Log Error:', error);
}

// Global hook for production logging
bp_hooks.addHook('loop_completed', {
  id: 'production-logger',
  type: 'action',
  priority: 500,
  callback: logLoopToProduction
});
