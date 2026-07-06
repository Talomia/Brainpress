import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const CalculatorPlugin: Plugin = {
  id: 'bp-calc-tool',
  name: 'Mathematical Tools',
  version: '1.0.0',
  description: 'Adds calculation capabilities to Brainpress agents.',
  init: () => {
    // Register the tool handler
    bp_hooks.addHook('tool_handler_calculate', {
      id: 'calc-handler',
      type: 'filter',
      priority: 10,
      callback: (args: { expression: string }) => {
        try {
          // Note: In production use a safe math parser
          return eval(args.expression);
        } catch (e) {
          return "Calculation error";
        }
      },
    });

    // Intercept reasoning to trigger tool if needed
    bp_hooks.addHook('discover_tool_call', {
      id: 'calc-trigger',
      type: 'filter',
      priority: 10,
      callback: (current: any, { state }: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg.role === 'user' && lastMsg.content.includes('calc:')) {
          const expr = lastMsg.content.split('calc:')[1].trim();
          return { name: 'calculate', args: { expression: expr } };
        }
        return current;
      },
    });
  },
};
