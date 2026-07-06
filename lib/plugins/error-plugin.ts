import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const ErrorHandlingPlugin: Plugin = {
  id: 'bp-error-sentinel',
  name: 'Error Sentinel',
  version: '1.0.0',
  description: 'Catches and gracefully handles loop failures.',
  init: () => {
    bp_hooks.addHook('loop_completed', {
      id: 'error-check',
      type: 'action',
      priority: 999,
      callback: (state: any) => {
        if (state.messages.length === 1) { // Only user message, no assistant response
          state.messages.push({ 
            role: 'assistant', 
            content: "I encountered an error during my reasoning loop. Please try again or simplify your request." 
          });
        }
      },
    });
  },
};
