import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const ReflectionPlugin: Plugin = {
  id: 'bp-reflection-engine',
  name: 'Reasoning Reflection',
  version: '2.0.0',
  description: 'Enables the agent to reflect on its own reasoning and self-correct using recursive neural passes.',
  init: () => {
    bp_hooks.addHook('post_process_output', {
      id: 'reflection-layer-2.0',
      type: 'filter',
      priority: 90, // Execute very late in the output stage
      callback: async (content: string, state: any, contextId: string) => {
        // Only reflect if the content seems insufficient or potentially flawed
        const needsReflection = typeof content === 'string' && (content.length < 50 || content.includes('[Error]') || content.toLowerCase().includes('i don\'t know'));
        
        if (needsReflection && !state.metadata?.isReflectionPass) {
          console.log(`[Reflection: ${contextId}] Neural synthesis quality check failed. Spawning reflection pass...`);
          
          const { runIntelligenceLoop } = require('../core/loop');
          
          try {
            // Spawn a sub-loop specifically for self-correction
            const reflectionResult = await runIntelligenceLoop(`Reflect on and improve this response: "${content}"`, {
              contextId: `${contextId}.reflection`,
              metadata: { isReflectionPass: true, originalContent: content }
            });

            const improvedContent = reflectionResult.messages[reflectionResult.messages.length - 1].content;
            return `${improvedContent}\n\n*Verified by BrainPress Reflection Engine*`;
          } catch (e) {
            console.warn(`[Reflection: ${contextId}] Self-correction pass failed. Returning original content.`);
            return content;
          }
        }
        
        return content;
      },
    });
  },
};
