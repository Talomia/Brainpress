import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const AdaptiveContextPlugin: Plugin = {
  id: 'bp-adaptive-context',
  name: 'Adaptive Context Compression',
  version: '1.0.0',
  description: 'Dynamically manages context window to ensure the most relevant information is always available.',
  init: () => {
    bp_hooks.addHook('after_input_received', {
      id: 'context-compressor',
      type: 'action',
      priority: 5,
      callback: (state: any) => {
        if (state.messages.length > 20) {
          console.log('[Context] Compressing history to maintain efficiency.');
          // Logic to summarize old messages and replace them
          const summary = `[System Summary of previous 10 messages]`;
          state.messages = [
            { role: 'system', content: summary },
            ...state.messages.slice(-10)
          ];
        }
      },
    });
  },
};
