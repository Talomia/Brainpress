import { bp_hooks } from './hooks';

export type ToolResult = {
  tool: string;
  result: any;
  status: 'success' | 'error';
};

/**
 * BrainPress 2.0 Tool Executor
 * Hardened for context-aware tool execution and error management.
 */
export async function executeTool(name: string, args: any, contextId: string = 'global'): Promise<ToolResult> {
  try {
    // 1. Context-Aware Handler Lookup
    // In BrainPress 2.0, callbacks receive (data, args, contextId)
    const result = await bp_hooks.applyFilters(`tool_handler_${name}`, null, { args }, contextId);
    
    if (result === null) {
      console.warn(`[Tools: ${contextId}] Warning: Tool "${name}" returned null or has no active handler.`);
      return { 
        tool: name, 
        result: `Intelligence Bridge Error: Tool "${name}" failed to synthesize a valid response in context ${contextId}.`, 
        status: 'error' 
      };
    }

    // 2. Post-Execution Governance
    await bp_hooks.doAction('tool_executed', { name, args, result }, contextId);
    
    return { tool: name, result, status: 'success' };
  } catch (error: any) {
    console.error(`[Tools: ${contextId}] Execution Failure [${name}]:`, error);
    return { 
      tool: name, 
      result: `[Neural Collision] ${error.message}`, 
      status: 'error' 
    };
  }
}
