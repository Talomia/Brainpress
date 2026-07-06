export type HookType = 'action' | 'filter';

export interface BrainpressHook {
  id: string;
  type: HookType;
  callback: (...args: any[]) => any | Promise<any>;
  priority: number;
}

class HookManager {
  private hooks: Map<string, BrainpressHook[]> = new Map();

  addHook(tag: string, hook: BrainpressHook) {
    if (!this.hooks.has(tag)) {
      this.hooks.set(tag, []);
    }
    
    // Prevent duplicate hook IDs
    const existing = this.hooks.get(tag);
    if (existing?.some(h => h.id === hook.id)) {
      this.removeHook(tag, hook.id);
    }

    this.hooks.get(tag)?.push(hook);
    this.hooks.get(tag)?.sort((a, b) => a.priority - b.priority);
  }

  removeHook(tag: string, hookId: string) {
    if (this.hooks.has(tag)) {
      const filtered = this.hooks.get(tag)?.filter(h => h.id !== hookId) || [];
      this.hooks.set(tag, filtered);
    }
  }

  async doAction(tag: string, ...args: any[]) {
    const hooks = this.hooks.get(tag) || [];
    for (const hook of hooks) {
      if (hook.type === 'action') {
        await (hook.callback as any)(...args);
      }
    }
  }

  async applyFilters(tag: string, data: any, ...args: any[]): Promise<any> {
    const hooks = this.hooks.get(tag) || [];
    let filteredData = data;
    for (const hook of hooks) {
      if (hook.type === 'filter') {
        filteredData = await (hook.callback as any)(filteredData, ...args);
      }
    }
    return filteredData;
  }

  getHooks(tag: string) {
    return this.hooks.get(tag) || [];
  }
}

export const bp_hooks = new HookManager();
