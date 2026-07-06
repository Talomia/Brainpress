import { bp_hooks } from './hooks';

/**
 * AgentPersona represents the unified entity merging "Agents" and "Themes".
 * Each Agent is now a stateful persona with unique neural hooks, tool access, and UI styles.
 */
export interface AgentPersona {
  id: string;
  name: string;
  icon: string;
  description: string;
  system_prompt: string;
  allowed_plugins: string[]; // Role-based tool access
  styles: {
    accentColor: string;
    glowColor: string;
  };
}

class AgentManager {
  private agents: Map<string, AgentPersona> = new Map();
  private activeAgentId: string | null = null;

  constructor() {
    this.registerDefaultAgents();
  }

  private registerDefaultAgents() {
    this.registerAgent({
      id: 'researcher',
      name: 'Research Pro',
      icon: '🧬',
      description: 'A highly analytical agent focused on academic search and evidence-based reasoning.',
      system_prompt: '[Research Mode] Analyze rigorously and cite sources where possible:',
      allowed_plugins: ['bp-search', 'bp-analytics', 'bp-rag'],
      styles: { accentColor: '#0070f3', glowColor: 'rgba(0, 112, 243, 0.4)' }
    });

    this.registerAgent({
      id: 'architect',
      name: 'Code Whisperer',
      icon: '💻',
      description: 'Technical, concise, and optimized for system design and code efficiency.',
      system_prompt: '[System Architect Mode] Optimize this architecture inquiry for performance and scalability:',
      allowed_plugins: ['bp-search', 'bp-analytics'],
      styles: { accentColor: '#00ff00', glowColor: 'rgba(0, 255, 0, 0.4)' }
    });

    this.registerAgent({
      id: 'muse',
      name: 'Creative Muse',
      icon: '🎨',
      description: 'Specialized in narrative generation, imaginative expansion, and creative writing.',
      system_prompt: '[Creative Muse Mode] Imagine and expand upon this inquiry with artistic flair:',
      allowed_plugins: ['bp-search'],
      styles: { accentColor: '#ff0080', glowColor: 'rgba(255, 0, 128, 0.4)' }
    });

    this.registerAgent({
      id: 'zen',
      name: 'Zen Master',
      icon: '🧘',
      description: 'Minimalist, calm, and focused on extracting the core essence of any inquiry.',
      system_prompt: '[Zen Mode] Simplify this to its absolute core essence:',
      allowed_plugins: [],
      styles: { accentColor: '#ffffff', glowColor: 'rgba(255, 255, 255, 0.2)' }
    });
  }

  registerAgent(agent: AgentPersona) {
    this.agents.set(agent.id, agent);
  }

  getAllAgents(): AgentPersona[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): AgentPersona | undefined {
    return this.agents.get(id);
  }

  async activateAgent(id: string) {
    const agent = this.agents.get(id);
    if (!agent) throw new Error(`Agent ${id} not found`);
    
    this.activeAgentId = id;
    
    // Brainpress 2.0: Scoped Neural Hook
    // Instead of global pollution, we register this hook specifically for the agent's contextId (which matches its id)
    bp_hooks.addHook('pre_process_input', {
      id: 'agent-persona-interceptor',
      type: 'filter',
      priority: 10,
      callback: (input: string) => `${agent.system_prompt} ${input}`
    }, id);

    // 2.0 Governance Hook: Scoped tool filtering
    bp_hooks.addHook('discover_tool_call', {
      id: 'agent-tool-governance',
      type: 'filter',
      priority: 1,
      callback: (toolName: string) => {
        if (agent.allowed_plugins.length > 0 && !agent.allowed_plugins.some(p => toolName.includes(p))) {
            console.warn(`[Governance: ${id}] Blocked unauthorized tool: ${toolName}`);
            return null; 
        }
        return toolName;
      }
    }, id);

    await bp_hooks.doAction('agent_activated', [agent], id);
  }

  getActiveAgent(): AgentPersona | undefined {
    return this.activeAgentId ? this.agents.get(this.activeAgentId) : this.agents.get('researcher');
  }
}

export const bp_agents = new AgentManager();
