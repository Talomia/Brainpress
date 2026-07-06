import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import { bp_supabase } from '../supabase/client';

// Mock storage for local/test environments where Supabase isn't reachable
const mockAnalyticsStore: any[] = [];

export const AnalyticsPlugin: Plugin = {
  id: 'bp-analytics',
  name: 'Intelligence Analytics',
  version: '2.0.0',
  description: 'Tracks performance, token usage, and agent efficiency in production.',
  init: () => {
    bp_hooks.addHook('loop_completed', {
      id: 'track-stats-production',
      type: 'action',
      priority: 250,
      callback: async (state: any) => {
        const tokens = state.messages.reduce((acc: number, m: any) => acc + (m.content?.length || 0) / 4, 0);
        const record = {
          loop_id: Math.random().toString(36).substring(7),
          tokens_used: tokens,
          steps: state.steps,
          metadata: state.metadata,
          created_at: new Date().toISOString()
        };

        mockAnalyticsStore.push(record);

        try {
          if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
             await bp_supabase.from('bp_analytics').insert([record]);
             console.log('[Analytics] Production metrics recorded to Supabase.');
          }
        } catch (e) {
          console.warn('[Analytics] Supabase persistence failed, using local memory.');
        }
      },
    });

    bp_hooks.addHook('get_analytics_summary', {
      id: 'fetch-analytics-summary',
      type: 'filter',
      priority: 10,
      callback: async () => {
        try {
          let data = [];
          if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            const { data: dbData, error } = await bp_supabase
              .from('bp_analytics')
              .select('tokens_used, steps');
            if (!error) data = dbData;
          }
          
          // Fallback to local store for tests/offline
          if (data.length === 0) data = mockAnalyticsStore;

          const totalLoops = data.length;
          const totalTokens = data.reduce((acc, curr) => acc + (curr.tokens_used || 0), 0);
          const avgSteps = totalLoops > 0 ? data.reduce((acc, curr) => acc + (curr.steps || 0), 0) / totalLoops : 0;

          return { totalLoops, totalTokens, avgSteps };
        } catch (e) {
          return { totalLoops: mockAnalyticsStore.length, totalTokens: 0, avgSteps: 0 };
        }
      }
    });
  },
};
