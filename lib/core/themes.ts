import { bp_hooks } from './hooks';

export interface Theme {
  id: string;
  name: string;
  styles: Record<string, string>;
  persona_config: Record<string, any>;
}

class ThemeManager {
  private themes: Map<string, Theme> = new Map();
  private activeThemeId: string | null = null;

  registerTheme(theme: Theme) {
    this.themes.set(theme.id, theme);
    bp_hooks.doAction('theme_registered', theme);
  }

  async activateTheme(id: string) {
    const theme = this.themes.get(id);
    if (!theme) throw new Error(`Theme ${id} not found`);
    
    this.activeThemeId = id;
    
    // Apply theme-specific persona filters
    bp_hooks.addHook('reasoning_engine', {
      id: `theme-persona-${id}`,
      type: 'filter',
      priority: 1, // High priority to set the base persona
      callback: (content: string) => {
        return `[System Persona: ${theme.name}] ${content}`;
      },
    });

    await bp_hooks.doAction('theme_activated', theme);
  }

  getActiveTheme(): Theme | undefined {
    return this.activeThemeId ? this.themes.get(this.activeThemeId) : undefined;
  }
}

export const bp_themes = new ThemeManager();
