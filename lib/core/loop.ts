import { bp_hooks } from './hooks';
import { executeTool } from './tools';

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: any[];
}

export interface IntelligenceState {
  messages: Message[];
  metadata: Record<string, any>;
  steps: number;
}

const MAX_STEPS = 5;

export async function runIntelligenceLoop(input: string, initialState: Partial<IntelligenceState> = {}) {
  let state: IntelligenceState = {
    messages: [...(initialState.messages || [])],
    metadata: { ...(initialState.metadata || {}) },
    steps: 0,
  };

  try {
    // Filter input
    const filteredInput = await bp_hooks.applyFilters('pre_process_input', input, { state });
    
    // Check if input was blocked or modified to an error
    if (filteredInput === null) {
      throw new Error("Input blocked by safety filters.");
    }
    
    state.messages.push({ role: 'user', content: filteredInput });
    await bp_hooks.doAction('after_input_received', state);

    // Autonomous Reasoning Loop (ReAct pattern)
    while (state.steps < MAX_STEPS) {
      state.steps++;

      // 1. Reasoning Step
      let responseContent = await bp_hooks.applyFilters('reasoning_engine', "Thinking...", { state });
      
      // 2. Tool Discovery
      const toolRequest = await bp_hooks.applyFilters('discover_tool_call', null, { state, responseContent });

      if (toolRequest) {
        const toolResult = await executeTool(toolRequest.name, toolRequest.args);
        state.messages.push({ 
          role: 'tool', 
          content: typeof toolResult.result === 'string' ? toolResult.result : JSON.stringify(toolResult.result),
          metadata: { tool: toolRequest.name, status: toolResult.status } 
        } as any);
        
        await bp_hooks.doAction('after_tool_call', { state, toolResult });
        continue; 
      }

      // 3. Final Output Generation
      const finalOutput = await bp_hooks.applyFilters('post_process_output', responseContent, { state });
      state.messages.push({ role: 'assistant', content: finalOutput });
      break;
    }
  } catch (error: any) {
    await bp_hooks.doAction('loop_error', { error, state });
    state.messages.push({ role: 'assistant', content: `[Error] ${error.message}` });
  }

  await bp_hooks.doAction('loop_completed', state);
  return state;
}
