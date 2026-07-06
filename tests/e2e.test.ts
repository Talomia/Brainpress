import { bp_hooks } from '../lib/core/hooks';
import { runIntelligenceLoop } from '../lib/core/loop';
import { bp_plugins } from '../lib/core/plugins';
import { SemanticSearchPlugin } from '../lib/plugins/semantic-search';

describe('Brainpress End-to-End Production Validation', () => {
  beforeAll(async () => {
    await bp_plugins.register(SemanticSearchPlugin);
  });

  test('E2E: Semantic search tool should be discoverable and executable', async () => {
    // Manually trigger a tool call via reasoning intercept
    bp_hooks.addHook('discover_tool_call', {
      id: 'e2e-trigger',
      type: 'filter',
      priority: 1,
      callback: (curr: any) => ({ name: 'semantic_search', args: { query: 'neural hooks' } })
    });

    const result = await runIntelligenceLoop('explain neural hooks');
    const toolMsg = result.messages.find(m => m.role === 'tool');
    // Updated for BrainPress 2.0 Case-Sensitivity (BrainPress)
    expect(toolMsg?.content).toContain('BrainPress uses a neural hook architecture');
  });

  test('E2E: Analytics should record accurate loop telemetry', async () => {
    const { AnalyticsPlugin } = require('../lib/plugins/analytics-plugin');
    await bp_plugins.register(AnalyticsPlugin);
    
    await runIntelligenceLoop('test analytics');
    const stats = await bp_hooks.applyFilters('get_analytics_summary', null);
    expect(stats.totalLoops).toBeGreaterThan(0);
  });
});
