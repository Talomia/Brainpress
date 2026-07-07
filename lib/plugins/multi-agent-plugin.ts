import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const MultiAgentPlugin: Plugin = {
  id: 'bp-multi-agent',
  name: 'Agent Orchestrator',
  version: '1.0.0',
  description: 'Enables delegation of tasks to specialized sub-agents.',
  init: () => {
    bp_hooks.addHook('reasoning_engine', {
      id: 'delegation-logic',
      type: 'filter',
      priority: 20,
      callback: (content: string, { state }: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg.role === 'user' && lastMsg.content.includes('@researcher')) {
          return `[Delegated to Researcher] Investigating complex topic: ${lastMsg.content}`;
        }
        return content;
      },
    });
  },
};
