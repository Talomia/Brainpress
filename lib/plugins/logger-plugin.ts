import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const LoggerPlugin: Plugin = {
  id: 'bp-logger',
  name: 'Intelligence Logger',
  version: '1.0.0',
  description: 'Logs all intelligence loop activities to the console (and potentially Supabase).',
  init: () => {
    bp_hooks.addHook('loop_completed', {
      id: 'log-completion',
      type: 'action',
      priority: 100,
      callback: (state: any) => {
        console.log('[Brainpress Log] Loop Completed:', {
          messageCount: state.messages.length,
          lastResponse: state.messages[state.messages.length - 1].content.substring(0, 50) + '...',
          timestamp: new Date().toISOString()
        });
      },
    });

    bp_hooks.addHook('pre_process_input', {
      id: 'log-input',
      type: 'filter',
      priority: 0,
      callback: (input: string) => {
        console.log('[Brainpress Log] Input Received:', input);
        return input;
      }
    });
  },
};
