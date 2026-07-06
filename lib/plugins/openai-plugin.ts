import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import OpenAI from 'openai';

export const OpenAIPlugin: Plugin = {
  id: 'bp-openai-core',
  name: 'OpenAI Intelligence Bridge',
  version: '1.0.0',
  description: 'Connects the intelligence loop to OpenAI models (GPT-4o/GPT-3.5).',
  init: () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    // We use a high priority to ensure it can act as the primary reasoner
    bp_hooks.addHook('reasoning_engine', {
      id: 'openai-reasoner',
      type: 'filter',
      priority: 5, 
      callback: async (input: string, context: any) => {
        if (!apiKey || apiKey === 'placeholder') {
          console.warn('[OpenAI] No API Key found, skipping reasoning phase.');
          return input;
        }

        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true // Required for client-side demo if needed
        });

        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are the Brainpress Intelligence OS. Provide deep, analytical, and structured insights." },
              { role: "user", content: input }
            ],
            stream: false,
          });

          return response.choices[0].message.content || 'No response from OpenAI';
        } catch (error) {
          console.error('[OpenAI] Error:', error);
          return `[OpenAI Error] ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      },
    });
  },
};
