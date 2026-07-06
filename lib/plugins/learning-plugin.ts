import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import { bp_supabase } from '../supabase/client';

export const AdaptiveLearningPlugin: Plugin = {
  id: 'bp-adaptive-learning',
  name: 'Adaptive Self-Learning',
  version: '1.0.0',
  description: 'Allows agents to learn from user corrections and persist knowledge in production.',
  init: () => {
    // 1. Recall past knowledge on input
    bp_hooks.addHook('pre_process_input', {
      id: 'learning-lookup-production',
      type: 'filter',
      priority: 2,
      callback: async (input: string) => {
        const normalizedInput = input.trim().toLowerCase();
        
        try {
          const { data } = await bp_supabase
            .from('bp_learning_weights')
            .select('correction')
            .eq('original_query', normalizedInput)
            .maybeSingle();

          if (data) {
            console.log(`[Learning] Production recall: ${data.correction}`);
            return `[System Learning: User previously corrected this to: "${data.correction}"]\n${input}`;
          }
        } catch (e) {
          console.warn('[Learning] Recall failed:', e);
        }
        return input;
      },
    });

    // 2. Capture new corrections on completion
    bp_hooks.addHook('loop_completed', {
      id: 'correction-capture-production',
      type: 'action',
      priority: 400,
      callback: async (state: any) => {
        const messages = state.messages;
        if (messages.length < 3) return;

        const lastUserMsg = messages[messages.length - 2];
        const originalUserMsg = messages[0];
        
        if (lastUserMsg?.role === 'user' && (lastUserMsg.content.toLowerCase().startsWith('no,') || lastUserMsg.content.toLowerCase().startsWith('correct:'))) {
          const correction = lastUserMsg.content.split(':')[1]?.trim() || lastUserMsg.content.replace(/no, /i, '').trim();
          
          try {
            await bp_supabase.from('bp_learning_weights').upsert({
              original_query: originalUserMsg.content.trim().toLowerCase(),
              correction: correction,
              updated_at: new Date().toISOString()
            });
            console.log('[Learning] Production knowledge captured.');
          } catch (e) {
            console.warn('[Learning] Capture failed:', e);
          }
        }
      },
    });
  },
};
