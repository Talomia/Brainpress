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
  isTerminated?: boolean;
}

const MAX_STEPS = 5;

/**
 * Brainpress 2.0 Loop: Implements Context-Aware Reasoning & Chain-of-Thought
 * Hardened for Elite production deployment with structured state termination and context propagation.
 */
export async function runIntelligenceLoop(input: string, initialState: Partial<IntelligenceState> = {}) {
  const contextId = initialState.contextId || 'global';
  let state: IntelligenceState = {
    sessionId: initialState.sessionId || Math.random().toString(36).substring(7),
    contextId,
    messages: [...(initialState.messages || [])],
    metadata: { ...(initialState.metadata || {}) },
    steps: 0,
    isTerminated: false,
  };

  try {
    // 1. Neural Pre-processing (Scoped to context)
    // Signature: (data, { state, contextId })
    const filteredInput = await bp_hooks.applyFilters('pre_process_input', input, { state, contextId }, contextId);
    
    if (state.isTerminated) {
      state.messages.push({ role: 'user', content: input });
      state.messages.push({ role: 'assistant', content: filteredInput });
      return state;
    }
    
    if (filteredInput === null) {
      throw new Error("Input suppressed by contextual security policy.");
    }
    
    state.messages.push({ role: 'user', content: filteredInput });
    await bp_hooks.doAction('after_input_received', { state, contextId }, contextId);

    // 2. Chain-of-Thought Reasoning Loop
    while (state.steps < MAX_STEPS && !state.isTerminated) {
      state.steps++;

      // Contextual Reasoning Phase
      const reasoningPrompt = await bp_hooks.applyFilters('reasoning_engine', "Processing neural hook context...", { state, contextId });
      
      // 3. Tool Discovery & Execution
      // Standard signature passing: data=null, args={ state, contextId }
      const toolRequest = await bp_hooks.applyFilters('discover_tool_call', null, { state, contextId });

      if (toolRequest && !state.isTerminated) {
        await bp_hooks.doAction('before_tool_call', { state, toolRequest });
        
        const toolResult = await executeTool(toolRequest.name, toolRequest.args, contextId);
        
        state.messages.push({ 
          role: 'tool', 
          content: typeof toolResult.result === 'string' ? toolResult.result : JSON.stringify(toolResult.result),
          metadata: { tool: toolRequest.name, status: toolResult.status } 
        });
        
        await bp_hooks.doAction('after_tool_call', { state, toolResult });
        continue; 
      }

      // 4. Final Neural Synthesis
      const finalOutput = await bp_hooks.applyFilters('post_process_output', reasoningPrompt, { state, contextId });
      state.messages.push({ role: 'assistant', content: finalOutput });
      break;
    }
  } catch (error: any) {
    await bp_hooks.doAction('loop_error', { error, state });
    state.messages.push({ role: 'assistant', content: `[Neural Failure] ${error.message}` });
  }

  await bp_hooks.doAction('loop_completed', { state, contextId });
  return state;
}
