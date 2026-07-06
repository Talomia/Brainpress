import { Plugin } from './plugins';
import { bp_supabase } from '../supabase/client';

class PluginManager {
  private plugins: Plugin[] = [];

  async register(plugin: Plugin) {
    if (this.plugins.find(p => p.id === plugin.id)) return;
    
    this.plugins.push(plugin);
    if (plugin.init) {
      await plugin.init();
    }

    // PERSISTENCE: Record plugin activation in Supabase
    try {
      await bp_supabase.from('plugin_registry').upsert({
        plugin_id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        status: 'active',
        last_activated: new Date().toISOString()
      });
    } catch (e) {
      console.warn(`[PluginManager] Persistence failed for ${plugin.id}:`, e);
    }
  }

  getAllPlugins() {
    return this.plugins;
  }

  async syncWithProduction() {
    // Load persisted configurations or state from Supabase if needed
    console.log('[PluginManager] Syncing plugin ecosystem with Supabase production state...');
  }
}

export const bp_plugins = new PluginManager();
