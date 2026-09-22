/**
 * MCP tool scopes. Declared and attached to every tool now, but not yet
 * enforced (Phase 1) — the resolver grants all scopes. Declaring them early
 * means Phase 3 scope enforcement needs no tool-by-tool retrofit.
 */

export const LEDGERS_READ = "ledgers:read";
export const LEDGERS_WRITE = "ledgers:write";

export const ALL_SCOPES = [LEDGERS_READ, LEDGERS_WRITE] as const;

export type McpScope = (typeof ALL_SCOPES)[number];
