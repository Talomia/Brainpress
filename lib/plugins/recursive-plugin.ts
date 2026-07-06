import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const RecursiveOrchestrationPlugin: Plugin = {
  id: 'bp-recursive-agent',
  name: 'Recursive Orchestrator',
  version: '2.0.0',
  description: 'Allows agents to recursively spawn sub-loops to solve sub-problems with context preservation.',
  init: () => {
    bp_hooks.addHook('discover_tool_call', {
      id: 'recursive-spawn',
      type: 'filter',
      priority: 5,
      callback: (current: any, state: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg.role === 'user' && lastMsg.content.toLowerCase().includes('complex:')) {
          const task = lastMsg.content.split(/complex:/i)[1].trim();
          return { name: 'spawn_sub_agent', args: { task } };
        }
        return current;
      },
    });

    bp_hooks.addHook('tool_handler_spawn_sub_agent', {
      id: 'sub-agent-handler-2.0',
      type: 'filter',
      priority: 10,
      callback: async (data: any, args: { task: string }, contextId: string) => {
        if (!args || !args.task) return data;
        
        console.log(`[RecursiveOrchestrator: ${contextId}] Spawning sub-loop for: "${args.task}"`);
        
        // Circular dependency prevention
        const { runIntelligenceLoop } = require('../core/loop');
        
        try {
          const subContextId = `${contextId}.sub.${Math.random().toString(36).substring(7)}`;
          const subResult = await runIntelligenceLoop(args.task, { 
            contextId: subContextId,
            metadata: { parentContext: contextId, type: 'sub-task' } 
          });

          const finalAnswer = subResult.messages[subResult.messages.length - 1].content;
          return `[Sub-Agent Result] Execution finished in context ${subContextId}. \n\nSummary: ${finalAnswer}`;
        } catch (e) {
          console.error(`[RecursiveOrchestrator: ${contextId}] Sub-loop failed:`, e);
          return `[Sub-Agent Error] Failed to process complex task recursively.`;
        }
      },
    });
  },
};
