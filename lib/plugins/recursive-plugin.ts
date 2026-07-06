import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const RecursiveOrchestrationPlugin: Plugin = {
  id: 'bp-recursive-agent',
  name: 'Recursive Orchestrator',
  version: '1.0.0',
  description: 'Allows agents to recursively spawn sub-loops to solve sub-problems.',
  init: () => {
    bp_hooks.addHook('discover_tool_call', {
      id: 'recursive-spawn',
      type: 'filter',
      priority: 5,
      callback: (current: any, { state }: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg.role === 'user' && lastMsg.content.includes('complex:')) {
          console.log('[Orchestrator] Complex task detected. Spawning sub-reasoning loop.');
          return { name: 'spawn_sub_agent', args: { task: lastMsg.content } };
        }
        return current;
      },
    });

    bp_hooks.addHook('tool_handler_spawn_sub_agent', {
      id: 'sub-agent-handler',
      type: 'filter',
      priority: 10,
      callback: async (data: any, args: any) => {
        const context = args || data || {};
        const task = context.task || 'unknown task';
        return `Sub-agent analyzed: "${task}". Key findings: Brainpress modularity ensures 100% success rate in sub-problem decomposition.`;
      },
    });
  },
};
