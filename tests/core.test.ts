import { bp_hooks } from '../lib/core/hooks';
import { runIntelligenceLoop } from '../lib/core/loop';
import { bp_plugins } from '../lib/core/plugins';
import { SearchPlugin } from '../lib/plugins/search-plugin';

describe('Brainpress Core Logic', () => {
  test('Hook system should correctly apply filters', async () => {
    bp_hooks.addHook('pre_process_input', {
      id: 'test-filter',
      type: 'filter',
      priority: 10,
      callback: (data: string) => `FILTERED: ${data}`,
    });

    const result = await bp_hooks.applyFilters('pre_process_input', 'hello');
    expect(result).toBe('FILTERED: hello');
  });

  test('Intelligence loop should execute tools correctly', async () => {
    // Clear any existing reasoning engines to ensure the mock one wins or we see the result
    bp_hooks.removeHook('reasoning_engine', 'real-gemini-reasoning-2.0');
    bp_hooks.removeHook('reasoning_engine', 'openai-reasoner-2.0');

    await bp_plugins.register(SearchPlugin);
    
    const result = await runIntelligenceLoop('search: BrainPress');
    
    // Check tool message
    const toolMsg = result.messages.find(m => m.role === 'tool');
    expect(toolMsg).toBeDefined();
    expect(toolMsg?.content).toContain('[Search Result]');
    
    // Check history for the search result content
    const hasSearchResult = result.messages.some(m => m.content && m.content.includes('BrainPress 2.0 implements a decoupled hook architecture'));
    expect(hasSearchResult).toBe(true);
  });
});
