import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';
import OpenAI from 'openai';

export const OpenAIPlugin: Plugin = {
  id: 'bp-openai-core',
  name: 'OpenAI Intelligence Bridge',
  version: '2.0.0',
  description: 'Connects the intelligence loop to OpenAI models (GPT-4o) with context-aware session management.',
  init: () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    bp_hooks.addHook('reasoning_engine', {
      id: 'openai-reasoner-2.0',
      type: 'filter',
      priority: 5, 
      callback: async (input: string, { state }: any, contextId: string) => {
        if (!apiKey || apiKey === 'placeholder') {
          console.warn(`[OpenAI: ${contextId}] No API Key found, skipping reasoning phase.`);
          return input;
        }

        const openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true 
        });

        try {
          // Construct chat history from the scoped state
          const history = state.messages.map((m: any) => ({
            role: m.role,
            content: m.content
          }));

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: `You are the BrainPress Intelligence OS (Persona: ${contextId}). Provide deep, analytical, and structured insights aligned with this persona.` },
              ...history,
              { role: "user", content: input }
            ],
            stream: false,
          });

          return response.choices[0].message.content || 'No response from OpenAI';
        } catch (error) {
          console.error(`[OpenAI: ${contextId}] Error:`, error);
          return `[OpenAI Error] ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      },
    });
  },
};
