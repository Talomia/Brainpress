import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const PersonaTheme: Plugin = {
  id: 'bp-theme-academic',
  name: 'Academic Researcher Persona',
  version: '1.0.0',
  description: 'Adjusts the tone of the intelligence to be more rigorous and academic.',
  init: () => {
    bp_hooks.addHook('pre_process_input', {
      id: 'academic-prompt',
      type: 'filter',
      priority: 5,
      callback: (input: string) => {
        return `Analyze the following inquiry with scientific rigor and provide a detailed, evidence-based response: ${input}`;
      },
    });

    bp_hooks.addHook('post_process_output', {
      id: 'academic-formatting',
      type: 'filter',
      priority: 90,
      callback: (output: string) => {
        return `[Academic Review Phase Completed]\n${output}\n\nConclusion derived from Brainpress Intelligence Framework.`;
      },
    });
  },
};
