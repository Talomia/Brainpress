# Brainpress Technical Documentation

## Overview
Brainpress is an autonomous intelligence platform built on a neural hook architecture. It allows developers to create agents that perceive, reason, and act within an extensible plugin ecosystem.

## Core Architecture

### Neural Hook System (`/lib/core/hooks.ts`)
The foundation of Brainpress is the `HookManager`. It facilitates decoupled communication through:
- **Actions:** One-way event triggers (`doAction`).
- **Filters:** Data transformation pipelines (`applyFilters`).

### Intelligence Loop (`/lib/core/loop.ts`)
The `runIntelligenceLoop` is the heart of the agent. It follows a ReAct pattern:
1.  **Pre-processing:** Input is sanitized and augmented via filters.
2.  **Reasoning:** The `reasoning_engine` filter generates thoughts.
3.  **Acting:** `discover_tool_call` identifies required tools, which are executed via `executeTool`.
4.  **Post-processing:** Output is formatted and recorded.

## Plugin Ecosystem
Plugins are the primary way to extend Brainpress. A plugin must implement the `Plugin` interface:
- `id`: Unique identifier.
- `init()`: Lifecycle hook to register hooks/filters.
- `dependencies`: (Optional) IDs of required plugins.

## Production Checklist
- [x] **Auth:** RBAC enforced in `auth.ts`.
- [x] **Persistence:** Real-world storage in `production-content.ts` and `production-logging.ts`.
- [x] **Resilience:** Hardened loop with error recovery and self-healing.
- [x] **Security:** Content sanitization and PII scrubbing.
- [x] **Scalability:** Recursive orchestration and adaptive context management.

## Deployment
1.  Set `NEXT_PUBLIC_GEMINI_API_KEY` and Supabase credentials.
2.  Run `npm run build` followed by `npm start`.
3.  Access the glassmorphic dashboard to monitor agent performance.
