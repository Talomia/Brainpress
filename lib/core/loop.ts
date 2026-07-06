import { bp_hooks } from './hooks';
import { executeTool } from './tools';

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: any[];
  metadata?: Record<string, any>;
}

export interface IntelligenceState {
  sessionId: string;
  contextId: string;
  messages: Message[];
  metadata: Record<string, any>;
  steps: number;
}

const MAX_STEPS = 5;

/**
 * Brainpress 2.0 Loop: Implements Context-Aware Reasoning & Chain-of-Thought
 */
export async function runIntelligenceLoop(input: string, initialState: Partial<IntelligenceState> = {}) {
  const contextId = initialState.contextId || 'global';
  let state: IntelligenceState = {
    sessionId: initialState.sessionId || Math.random().toString(36).substring(7),
    contextId,
    messages: [...(initialState.messages || [])],
    metadata: { ...(initialState.metadata || {}) },
    steps: 0,
  };

  try {
    // 1. Neural Pre-processing (Scoped to context)
    const filteredInput = await bp_hooks.applyFilters('pre_process_input', input, [{ state }], contextId);
    
    if (filteredInput === null) {
      throw new Error("Input suppressed by contextual security policy.");
    }
    
    state.messages.push({ role: 'user', content: filteredInput });
    await bp_hooks.doAction('after_input_received', [state], contextId);

    // 2. Chain-of-Thought Reasoning Loop
    while (state.steps < MAX_STEPS) {
      state.steps++;

      // Contextual Reasoning Phase
      const reasoningPrompt = await bp_hooks.applyFilters('reasoning_engine', "Processing neural hook context...", [{ state }], contextId);
      
      // Multi-Modal Integration Point
      const multimodalContext = await bp_hooks.applyFilters('multimodal_context', [], [{ state }], contextId);
      
      // 3. Tool Discovery & Execution
      const toolRequest = await bp_hooks.applyFilters('discover_tool_call', null, [{ state, reasoningPrompt, multimodalContext }], contextId);

      if (toolRequest) {
        await bp_hooks.doAction('before_tool_call', [{ state, toolRequest }], contextId);
        
        const toolResult = await executeTool(toolRequest.name, toolRequest.args);
        
        state.messages.push({ 
          role: 'tool', 
          content: typeof toolResult.result === 'string' ? toolResult.result : JSON.stringify(toolResult.result),
          metadata: { tool: toolRequest.name, status: toolResult.status } 
        });
        
        await bp_hooks.doAction('after_tool_call', [{ state, toolResult }], contextId);
        continue; 
      }

      // 4. Final Neural Synthesis
      const finalOutput = await bp_hooks.applyFilters('post_process_output', reasoningPrompt, [{ state }], contextId);
      state.messages.push({ role: 'assistant', content: finalOutput });
      break;
    }
  } catch (error: any) {
    await bp_hooks.doAction('loop_error', [{ error, state }], contextId);
    state.messages.push({ role: 'assistant', content: `[Neural Failure] ${error.message}` });
  }

  await bp_hooks.doAction('loop_completed', [state], contextId);
  return state;
}
