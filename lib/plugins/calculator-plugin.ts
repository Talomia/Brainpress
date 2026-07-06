import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const CalculatorPlugin: Plugin = {
  id: 'bp-calc-tool',
  name: 'Mathematical Tools',
  version: '2.0.0',
  description: 'Adds secure mathematical calculation capabilities to Brainpress agents.',
  init: () => {
    // 1. Secure Tool Handler
    // Brainpress 2.0: callback signature is (data, args, contextId)
    bp_hooks.addHook('tool_handler_calculate', {
      id: 'calc-handler-secure',
      type: 'filter',
      priority: 10,
      callback: (data: any, args: { expression: string }) => {
        try {
          if (!args || !args.expression) return data;

          // Remove all whitespace
          const sanitized = args.expression.replace(/\s+/g, '');
          
          // Only allow numbers, basic operators, and parentheses
          if (!/^[0-9+\-*/().]+$/.test(sanitized)) {
            throw new Error("Illegal characters in expression");
          }

          // Secure evaluation using Function constructor (isolated scope)
          const result = new Function(`return ${sanitized}`)();
          
          if (isNaN(result) || !isFinite(result)) {
            throw new Error("Invalid mathematical result");
          }

          return result.toString();
        } catch (e) {
          return `[Calc Error] ${e instanceof Error ? e.message : 'Invalid expression'}`;
        }
      },
    });

    // 2. Unified Tool Trigger
    bp_hooks.addHook('discover_tool_call', {
      id: 'calc-trigger',
      type: 'filter',
      priority: 10,
      callback: (current: any, { state }: any) => {
        const lastMsg = state.messages[state.messages.length - 1];
        if (lastMsg.role === 'user' && lastMsg.content.toLowerCase().includes('calc:')) {
          const expr = lastMsg.content.split(/calc:/i)[1].trim();
          return { name: 'calculate', args: { expression: expr } };
        }
        return current;
      },
    });
  },
};
