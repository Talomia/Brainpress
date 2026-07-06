import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const MultiAgentCollabPlugin: Plugin = {
  id: 'bp-multi-agent-collab',
  name: 'Multi-Agent Collaboration',
  version: '1.0.0',
  description: 'Enables multiple agents to collaborate on a single task through a shared intelligence workspace.',
  init: () => {
    const workspace: any[] = [];

    bp_hooks.addHook('after_tool_call', {
      id: 'shared-workspace-update',
      type: 'action',
      priority: 15,
      callback: ({ state, toolResult }: any) => {
        workspace.push({
          step: state.steps,
          insight: toolResult.result,
          source: toolResult.tool
        });
        console.log(`[Collab] Shared workspace updated by ${toolResult.tool}`);
      },
    });

    bp_hooks.addHook('reasoning_engine', {
      id: 'collab-context-injection',
      type: 'filter',
      priority: 5, // Early injection
      callback: (content: string) => {
        if (workspace.length > 0) {
          const collabContext = workspace.map(w => `[Agent ${w.source}]: ${w.insight}`).join('\n');
          return `[Collaborative Workspace Context]\n${collabContext}\n\n${content}`;
        }
        return content;
      },
    });
  },
};
