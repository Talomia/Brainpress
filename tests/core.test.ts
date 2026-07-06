import { bp_hooks } from '../lib/core/hooks';
import { runIntelligenceLoop } from '../lib/core/loop';
import { bp_plugins } from '../lib/core/plugins';
import { SearchPlugin } from '../lib/plugins/search-plugin';

describe('Brainpress Core Logic', () => {
  beforeEach(() => {
    // Reset hooks/plugins if necessary (not implemented in core yet, but for testing we assume fresh state)
  });

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

  test('Intelligence loop should execute hooks in order', async () => {
    await bp_plugins.register(SearchPlugin);
    const result = await runIntelligenceLoop('test query');
    
    const lastMessage = result.messages[result.messages.length - 1];
    expect(lastMessage.content).toContain('Search Plugin');
    expect(lastMessage.content).toContain('References: Brainpress Knowledge Base');
  });
});
