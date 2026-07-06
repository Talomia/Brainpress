import { bp_hooks } from '../lib/core/hooks';
import { runIntelligenceLoop } from '../lib/core/loop';
import { bp_plugins } from '../lib/core/plugins';
import { ReflectionPlugin } from '../lib/plugins/reflection-plugin';
import { RecursiveOrchestrationPlugin } from '../lib/plugins/recursive-plugin';

describe('Deep Logic Review: Brainpress Advanced Patterns', () => {
  test('Reflection plugin should self-correct reasoning', async () => {
    await bp_plugins.register(ReflectionPlugin);
    
    // Test case where reasoning might be "flawed" (too short)
    bp_hooks.addHook('reasoning_engine', {
      id: 'mock-short-reasoning',
      type: 'filter',
      priority: 10,
      callback: () => 'Too short.',
    });

    const result = await runIntelligenceLoop('test reflection');
    const lastMessage = result.messages[result.messages.length - 1];
    expect(lastMessage.content).toContain('Self-Correction');
  });

  test('Recursive orchestrator should spawn and handle sub-agent tools', async () => {
    await bp_plugins.register(RecursiveOrchestrationPlugin);
    
    const result = await runIntelligenceLoop('complex: design a neural hook system');
    
    // Check if tool message exists in history
    const toolMessage = result.messages.find(m => m.role === 'tool');
    expect(toolMessage).toBeDefined();
    expect(toolMessage?.content).toContain('[Sub-Agent Result]');
  });

  test('RBAC should correctly filter actions based on role', async () => {
    const { bp_auth } = require('../lib/core/auth');
    await bp_auth.login('user@editor.com');
    
    const hasPermission = await bp_auth.checkPermission('delete_core');
    expect(hasPermission).toBe(false); // Only admins should have this
  });
});
