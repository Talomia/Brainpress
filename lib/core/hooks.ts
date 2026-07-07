export type HookType = 'action' | 'filter';

export interface BrainpressHook {
  id: string;
  type: HookType;
  callback: (...args: any[]) => any | Promise<any>;
  priority: number;
}

/**
 * Brainpress 2.0 HookManager: Supports scoped contexts to prevent state pollution.
 * Contexts allow for sandboxed plugin registration and agent-specific neural overrides.
 */
class HookManager {
  private globalHooks: Map<string, BrainpressHook[]> = new Map();
  private contexts: Map<string, Map<string, BrainpressHook[]>> = new Map();

  addHook(tag: string, hook: BrainpressHook, contextId: string = 'global') {
    let hooksMap: Map<string, BrainpressHook[]>;
    
    if (contextId === 'global') {
      hooksMap = this.globalHooks;
    } else {
      if (!this.contexts.has(contextId)) {
        this.contexts.set(contextId, new Map());
      }
      hooksMap = this.contexts.get(contextId)!;
    }

    if (!hooksMap.has(tag)) {
      hooksMap.set(tag, []);
    }
    
    const existing = hooksMap.get(tag);
    if (existing?.some(h => h.id === hook.id)) {
      this.removeHook(tag, hook.id, contextId);
    }

    hooksMap.get(tag)?.push(hook);
    hooksMap.get(tag)?.sort((a, b) => a.priority - b.priority);
  }

  removeHook(tag: string, hookId: string, contextId: string = 'global') {
    const hooksMap = contextId === 'global' ? this.globalHooks : this.contexts.get(contextId);
    if (hooksMap?.has(tag)) {
      const filtered = hooksMap.get(tag)?.filter(h => h.id !== hookId) || [];
      hooksMap.set(tag, filtered);
    }
  }

  private getEffectiveHooks(tag: string, contextId: string = 'global'): BrainpressHook[] {
    const global = this.globalHooks.get(tag) || [];
    const contextual = (contextId !== 'global' ? this.contexts.get(contextId)?.get(tag) : []) || [];
    
    // Contextual hooks override or extend global ones
    return [...global, ...contextual].sort((a, b) => a.priority - b.priority);
  }

  async doAction(tag: string, context: any = {}, contextId: string = 'global') {
    const hooks = this.getEffectiveHooks(tag, contextId);
    const safeContext = context || {};
    for (const hook of hooks) {
      if (hook.type === 'action') {
        // Standard Brainpress 2.0 Action Signature: (context: { state, contextId, ... })
        await (hook.callback as any)({ ...safeContext, contextId });
      }
    }
  }

  async applyFilters(tag: string, data: any, context: any = {}, contextId: string = 'global'): Promise<any> {
    const hooks = this.getEffectiveHooks(tag, contextId);
    const safeContext = context || {};
    let filteredData = data;
    for (const hook of hooks) {
      if (hook.type === 'filter') {
        // Standard Brainpress 2.0 Filter Signature: (data, context: { state, contextId, ... })
        filteredData = await (hook.callback as any)(filteredData, { ...safeContext, contextId });
      }
    }
    return filteredData;
  }
}

export const bp_hooks = new HookManager();
