---
type: Guide
title: Testing the MCP server
description: Drive the MCP server's first-party (Bearer) path during UAT — mint a staging ID token and exercise the tools from a Claude Code session or the command line, locally or against a preview.
resource: scripts/mcp-smoke.mjs
tags: [mcp, testing, uat, staging, firebase, preview]
---

# Testing the MCP server

The MCP server (`/api/mcp`) authenticates a request with a **Firebase ID token as
`Bearer`** (Phase 1 — see epic #442). Because that token is just the app's own ID
token, the fastest way to UAT the tools is a small client that mints one and calls
the server — no OAuth, no GUI connector (connectors are Phase 2). The intended
workflow is to **ask a Claude Code session to test behavior**, which it does by
running the two scripts below.

Every MCP tool corresponds to a UI action (MCP ⊆ UI): the ledger tools map to the
ledgers pages' list/create/edit/delete. Testing a tool validates the same shared
server data layer (`src/server/data/*`) the UI calls.

## Prerequisites

- Seeded staging test users and the shared `STAGING_TEST_PASSWORD` — see
  [Staging Test Accounts](staging-test-accounts.md). Default account:
  `active@staging.test` (the richest data profile).
- Staging is a **separate Firebase project**, so test writes never touch
  production. Data shapes: [Firebase Realtime Database Schema](database-schema.md).

```bash
export STAGING_TEST_PASSWORD="<staging-only password>"
```

## Local loop (fastest)

Run the app locally and drive the server over `localhost` — no Vercel domain or
deployment-protection friction, same code as the deploy:

```bash
pnpm dev
```

```bash
pnpm mcp:smoke                                   # list the tools
```

```bash
pnpm mcp:smoke call list_ledgers                 # call a read tool
```

```bash
pnpm mcp:smoke call create_ledger '{"name":"Test","cashCap":500}'
```

`pnpm mcp:smoke` mints a fresh token itself (via `pnpm mcp:token`), performs the
MCP `initialize` handshake, and runs `tools/list` (default) or `tools/call`. It
prints the tool result as JSON.

> **Project match.** The ID token's Firebase project must equal the project the
> running server's Admin SDK verifies against. `mcp:token` mints against **staging**
> by default (`deployment/staging.yml`'s public API key). So point local `pnpm dev`
> at the staging project (its `.env.local`), or override `MCP_TEST_API_KEY` +
> `FIREBASE_*` to match whatever project you run.

### Just the token

```bash
pnpm mcp:token                                   # prints a fresh ID token (~1h TTL)
```

Env overrides: `MCP_TEST_EMAIL` (default `active@staging.test`),
`MCP_TEST_API_KEY` (default: staging), `STAGING_TEST_PASSWORD` (required).

## Preview / deployed loop

A preview exists only when the PR carries the **`ready for UAT`** label — the
`Preview Deploy` workflow then deploys and posts the URL as a sticky PR comment.
Point the smoke client at that URL's `/api/mcp`:

```bash
pnpm mcp:smoke --url https://<preview-host>/api/mcp call list_ledgers
```

Two things must be true for a deployed test to work:

- **Preview env parity.** The Vercel **Preview** environment must carry the staging
  Firebase **Admin** secrets (`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) and
  the staging public config, or every request 401s. Sync staging config with the
  env tooling (`envctl`) before labelling.
- **Deployment protection.** If previews sit behind Vercel Authentication, set
  `VERCEL_AUTOMATION_BYPASS_SECRET` (Protection Bypass for Automation) and the
  smoke client sends it as `x-vercel-protection-bypass` automatically.

## Troubleshooting

- **401 Unauthorized** — token expired (mint a fresh one), or the server's Admin
  creds are for a different Firebase project than the token (project mismatch), or
  (on a preview) deployment protection without the bypass secret.
- **Empty / HTML response** — you hit the Vercel auth wall; set the bypass secret.
- **`tools/list` empty** — the server built without the tools registered; check the
  deploy logs.

## Scripts

- [`scripts/mint-test-token.mjs`](../scripts/mint-test-token.mjs) — mint a staging
  ID token (`pnpm mcp:token`); also `import { mintTestToken }` for reuse.
- [`scripts/mcp-smoke.mjs`](../scripts/mcp-smoke.mjs) — MCP Streamable-HTTP client
  (`pnpm mcp:smoke`).
