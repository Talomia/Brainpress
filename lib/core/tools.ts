import { bp_hooks } from './hooks';

export type ToolResult = {
  tool: string;
  result: any;
  status: 'success' | 'error';
};

export async function executeTool(name: string, args: any): Promise<ToolResult> {
  try {
    // Brainpress 2.0: applyFilters expects [args] array
    const result = await bp_hooks.applyFilters(`tool_handler_${name}`, null, [args]);
    
    if (result === null) {
      return { tool: name, result: `Tool ${name} not found or returned no data.`, status: 'error' };
    }

    await bp_hooks.doAction('tool_executed', [{ name, args, result }]);
    return { tool: name, result, status: 'success' };
  } catch (error: any) {
    return { tool: name, result: error.message, status: 'error' };
  }
}
