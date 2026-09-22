/**
 * MCP tool scopes. Declared and attached to every tool now, but not yet
 * enforced (Phase 1) — the resolver grants all scopes. Declaring them early
 * means Phase 3 scope enforcement needs no tool-by-tool retrofit.
 */

export const GOALS_READ = "goals:read";
export const LEDGERS_READ = "ledgers:read";
export const LEDGERS_WRITE = "ledgers:write";
export const TRANSACTIONS_READ = "transactions:read";

export const ALL_SCOPES = [
  GOALS_READ,
  LEDGERS_READ,
  LEDGERS_WRITE,
  TRANSACTIONS_READ,
] as const;

export type McpScope = (typeof ALL_SCOPES)[number];
