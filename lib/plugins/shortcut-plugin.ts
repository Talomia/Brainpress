import { bp_hooks } from '../core/hooks';
import { Plugin } from '../core/plugins';

export const KeyboardShortcutPlugin: Plugin = {
  id: 'bp-shortcuts',
  name: 'Keyboard Power-User',
  version: '1.0.0',
  description: 'Adds global keyboard shortcuts for agent management.',
  init: () => {
    bp_hooks.addHook('register_client_shortcut', {
      id: 'dash-shortcuts',
      type: 'action',
      priority: 10,
      callback: (handler: any) => {
        // This hook would be consumed by the React client
        handler('ctrl+k', 'clear_chat');
        handler('ctrl+/', 'toggle_sidebar');
      },
    });
  },
};
