export type HookType = 'action' | 'filter';

export interface BrainpressHook {
  id: string;
  type: HookType;
  callback: (data: any, ...args: any[]) => any | Promise<any>;
  priority: number;
}

class HookManager {
  private hooks: Map<string, BrainpressHook[]> = new Map();

  addHook(tag: string, hook: BrainpressHook) {
    if (!this.hooks.has(tag)) {
      this.hooks.set(tag, []);
    }
    this.hooks.get(tag)?.push(hook);
    this.hooks.get(tag)?.sort((a, b) => a.priority - b.priority);
  }

  async doAction(tag: string, ...args: any[]) {
    const hooks = this.hooks.get(tag) || [];
    for (const hook of hooks) {
      if (hook.type === 'action') {
        await hook.callback(...args);
      }
    }
  }

  async applyFilters(tag: string, data: any, ...args: any[]): Promise<any> {
    const hooks = this.hooks.get(tag) || [];
    let filteredData = data;
    for (const hook of hooks) {
      if (hook.type === 'filter') {
        filteredData = await hook.callback(filteredData, ...args);
      }
    }
    return filteredData;
  }
}

export const bp_hooks = new HookManager();
