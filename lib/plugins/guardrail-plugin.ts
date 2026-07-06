import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const GuardrailPlugin: Plugin = {
  id: 'bp-guardrails-basic',
  name: 'Basic Guardrails',
  version: '1.0.0',
  description: 'Prevents harmful content and ensures output quality.',
  init: () => {
    bp_hooks.addHook('pre_process_input', {
      id: 'harmful-filter',
      type: 'filter',
      priority: 1,
      callback: (input: string) => {
        // Simple mock of a safety filter
        if (input.toLowerCase().includes('harmful')) {
          return "I cannot process harmful requests.";
        }
        return input;
      },
    });

    bp_hooks.addHook('post_process_output', {
      id: 'quality-check',
      type: 'filter',
      priority: 100,
      callback: (output: string) => {
        if (output.length < 10) {
          return `${output}\n(Note: The generated response was unusually short. Please refine your query for better results.)`;
        }
        return output;
      },
    });
  },
};
