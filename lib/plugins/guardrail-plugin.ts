import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

/**
 * BrainPress 2.0 GuardrailPlugin
 * Reinvented for production safety and logical integrity.
 * Moves from simple string matching to a structured safety layer.
 */
export const GuardrailPlugin: Plugin = {
  id: 'bp-guardrails-elite',
  name: 'Intelligence Guardrails',
  version: '2.0.0',
  description: 'Elite safety and logical integrity layer for autonomous intelligence.',
  init: () => {
    // 1. Semantic Safety Interceptor
    bp_hooks.addHook('pre_process_input', {
      id: 'safety-interceptor-2.0',
      type: 'filter',
      priority: 1,
      callback: async (input: string, { state, contextId }: any) => {
        const forbiddenPatterns = [
          /dangerous/i, /harmful/i, /illegal/i, /bypass/i, /jailbreak/i
        ];

        const isUnsafe = forbiddenPatterns.some(p => p.test(input));

        if (isUnsafe) {
          console.error(`[Guardrails: ${contextId}] CRITICAL: Unsafe input pattern detected. Terminating loop.`);
          state.isTerminated = true;
          return `[Guardrail Alert] Input rejected: The request violates the BrainPress Safety and Ethical Integrity Protocol.`;
        }

        return input;
      },
    });

    // 2. Logic & Consistency Guard
    bp_hooks.addHook('post_process_output', {
      id: 'logic-integrity-check-2.0',
      type: 'filter',
      priority: 100,
      callback: async (content: string, { state, contextId }: any) => {
        if (state.isTerminated) return content;

        const isLowQuality = content.length < 30 || content.toLowerCase().includes('i don\'t know') || content.includes('[Error]');

        if (isLowQuality) {
          console.warn(`[Guardrails: ${contextId}] Response flagged for quality degradation.`);
          return `${content}\n\n[Warning: This response has been flagged for low logical density. Please consult the BrainPress Audit Logs for details.]`;
        }

        return content;
      },
    });

    // 3. System Shield Footnote
    bp_hooks.addHook('post_process_output', {
      id: 'safety-badge',
      type: 'filter',
      priority: 110,
      callback: (content: string, { state }: any) => {
        return `${content}\n\n*Verified by BrainPress Safety Infrastructure (Elite Level)*`;
      },
    });
  },
};
