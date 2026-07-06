import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const AdaptiveLearningPlugin: Plugin = {
  id: 'bp-adaptive-learning',
  name: 'Adaptive Self-Learning',
  version: '1.0.0',
  description: 'Allows agents to learn from user corrections and refine their internal weights (simulated) over time.',
  init: () => {
    // Persistent memory bank for learning
    const memoryBank = new Map<string, string>();

    bp_hooks.addHook('pre_process_input', {
      id: 'learning-lookup',
      type: 'filter',
      priority: 2, // Early lookup
      callback: (input: string, { state }: any) => {
        const normalizedInput = input.trim().toLowerCase();
        if (memoryBank.has(normalizedInput)) {
          const learnedContext = memoryBank.get(normalizedInput);
          console.log(`[Learning] Past correction recalled: ${learnedContext}`);
          return `[System Learning: User previously corrected this to: "${learnedContext}"]\n${input}`;
        }
        return input;
      },
    });

    bp_hooks.addHook('loop_completed', {
      id: 'correction-capture',
      type: 'action',
      priority: 400,
      callback: (state: any) => {
        const messages = state.messages;
        if (messages.length < 3) return;

        const lastUserMsg = messages[messages.length - 2];
        const prevAssistantMsg = messages[messages.length - 3];
        const originalUserMsg = messages[0];
        
        if (lastUserMsg?.role === 'user' && (lastUserMsg.content.toLowerCase().startsWith('no,') || lastUserMsg.content.toLowerCase().startsWith('correct:'))) {
          console.log('[Learning] Validating and capturing user correction...');
          // Extract the actual correction part
          const correction = lastUserMsg.content.split(':')[1]?.trim() || lastUserMsg.content.replace(/no, /i, '').trim();
          memoryBank.set(originalUserMsg.content.trim().toLowerCase(), correction);
        }
      },
    });
  },
};
