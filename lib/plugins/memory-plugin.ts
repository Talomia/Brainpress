import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const MemoryPlugin: Plugin = {
  id: 'bp-short-term-memory',
  name: 'Short-term Memory',
  version: '1.0.0',
  description: 'Maintains context of the last few messages within the session.',
  init: () => {
    const memory: string[] = [];

    bp_hooks.addHook('after_input_received', {
      id: 'store-input',
      type: 'action',
      priority: 10,
      callback: (state: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg.role === 'user') {
          memory.push(`User: ${lastMsg.content}`);
          if (memory.length > 10) memory.shift();
        }
      },
    });

    bp_hooks.addHook('pre_process_input', {
      id: 'inject-context',
      type: 'filter',
      priority: 20,
      callback: (input: string) => {
        if (memory.length === 0) return input;
        return `[Context: ${memory.join(' | ')}]\nUser: ${input}`;
      },
    });
  },
};
