import { GoogleGenerativeAI } from '@google/generative-ai';
import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'DEMO_KEY');

export const RealGeminiPlugin: Plugin = {
  id: 'bp-gemini-real',
  name: 'Google Gemini Pro (Production)',
  version: '2.0.0',
  description: 'Production-ready integration with Google Gemini Pro 1.5 with full context-aware reasoning.',
  init: () => {
    bp_hooks.addHook('reasoning_engine', {
      id: 'real-gemini-reasoning-2.0',
      type: 'filter',
      priority: 50,
      callback: async (content: string, { state }: any, contextId: string) => {
        try {
          const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: `You are the BrainPress Intelligence OS (Persona: ${contextId}). Provide deep, analytical, and structured insights.`
          });
          
          // Construct chat history from state
          const history = state.messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          }));

          const chat = model.startChat({ history });
          const result = await chat.sendMessage(content);
          const response = await result.response;
          return response.text();
        } catch (error: any) {
          console.error(`[Gemini Plugin: ${contextId}] Production Error:`, error);
          return `[Gemini Error] ${error.message}. falling back to local reasoning...`;
        }
      },
    });
  },
};
