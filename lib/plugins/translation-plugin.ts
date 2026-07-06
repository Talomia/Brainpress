import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const TranslationPlugin: Plugin = {
  id: 'bp-translator',
  name: 'Multi-lingual Support',
  version: '1.0.0',
  description: 'Enables automatic translation of agent outputs.',
  init: () => {
    bp_hooks.addHook('post_process_output', {
      id: 'translation-layer',
      type: 'filter',
      priority: 85,
      callback: (content: string, { metadata }: any) => {
        if (metadata?.target_lang === 'es') {
          return `[Traducción al español]: ${content} (Simulado)`;
        }
        return content;
      },
    });
  },
};
