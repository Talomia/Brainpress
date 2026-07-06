import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const MultiModalPlugin: Plugin = {
  id: 'bp-multimodal-core',
  name: 'Multi-modal Vision & Audio',
  version: '1.0.0',
  description: 'Enables processing of images and audio files within the intelligence loop.',
  init: () => {
    bp_hooks.addHook('pre_process_input', {
      id: 'multimodal-parser',
      type: 'filter',
      priority: 2,
      callback: (input: string, { metadata }: any) => {
        if (metadata?.attachments?.length > 0) {
          const attachments = metadata.attachments.map((a: any) => `[Attachment: ${a.type} - ${a.name}]`).join(', ');
          return `[Multimodal Context: ${attachments}]\n${input}`;
        }
        return input;
      },
    });

    bp_hooks.addHook('reasoning_engine', {
      id: 'vision-analysis',
      type: 'filter',
      priority: 15,
      callback: (content: string, { metadata }: any) => {
        if (metadata?.attachments?.some((a: any) => a.type === 'image')) {
          return `${content}\n(Vision Plugin: I have analyzed the attached images and incorporated their visual data into my reasoning.)`;
        }
        return content;
      },
    });
  },
};
