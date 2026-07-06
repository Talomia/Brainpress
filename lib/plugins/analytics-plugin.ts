import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import { bp_supabase } from '../supabase/client';

export const AnalyticsPlugin: Plugin = {
  id: 'bp-analytics',
  name: 'Intelligence Analytics',
  version: '1.0.0',
  description: 'Tracks performance, token usage, and agent efficiency in production.',
  init: () => {
    bp_hooks.addHook('loop_completed', {
      id: 'track-stats-production',
      type: 'action',
      priority: 250,
      callback: async (state: any) => {
        const tokens = state.messages.reduce((acc: number, m: any) => acc + (m.content?.length || 0) / 4, 0);
        
        try {
          await bp_supabase.from('bp_analytics').insert([{
            loop_id: Math.random().toString(36).substring(7),
            tokens_used: tokens,
            steps: state.steps,
            metadata: state.metadata,
            created_at: new Date().toISOString()
          }]);
          console.log('[Analytics] Production metrics recorded.');
        } catch (e) {
          console.warn('[Analytics] Persistence failed:', e);
        }
      },
    });
  },
};
