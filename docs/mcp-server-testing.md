---
type: Guide
title: Testing the MCP server
description: The MCP staging test process — run the app against the staging Firebase project and exercise the MCP tools (locally, or against a preview) from a Claude Code session or the CLI.
resource: scripts/mcp-smoke.mjs
tags: [mcp, testing, uat, staging, firebase, preview]
---

# Testing the MCP server

The MCP server (`/api/mcp`) authenticates each request with a **Firebase ID token as
`Bearer`** (Phase 1 — see epic #442). Because that token is just the app's own ID
token, the fastest way to UAT the tools is a small client that mints one and calls the
server — no OAuth, no GUI connector (connectors are Phase 2). The intended workflow is
to **ask a Claude Code session to test behavior**, which it does by running the two
`pnpm` scripts below.

Every MCP tool corresponds to a UI action (MCP ⊆ UI): the ledger tools map to the
ledgers pages' list/create/edit/delete, and validating a tool exercises the same shared
server data layer (`src/server/data/*`) the UI calls.

## Primary loop: local dev against staging

This is the paved path — it runs the exact server code against **staging** data with no
Vercel deployment protection and no preview-env gaps, so a Claude Code session can drive
it end to end.

### One-time setup: `.env.local`

The server's Admin SDK (`src/lib/firebase/admin.ts`) reads `FIREBASE_PROJECT_ID`,
`FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_DATABASE_URL`; point them at
the **staging** service account so token verification and reads/writes hit the staging
project. Put the staging values — plus the seeded test users' shared password (see
[Staging Test Accounts](staging-test-accounts.md)) — in `.env.local` (gitignored):

```bash
# staging Firebase (admin SDK) — the staging service account, NOT production
FIREBASE_PROJECT_ID=personal-budget-staging-a99af
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-…@personal-budget-staging-a99af.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://personal-budget-staging-a99af-default-rtdb.firebaseio.com
# staging Firebase (client) — the public config from deployment/staging.yml
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=personal-budget-staging-a99af
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://personal-budget-staging-a99af-default-rtdb.firebaseio.com
# the seeded staging test users' shared password
STAGING_TEST_PASSWORD=<staging-only password>
```

Both the dev server and the `mcp:*` scripts load `.env.local` (the scripts via Node's
`--env-file-if-exists`), so the secrets stay in that one gitignored file — a session
never has to be handed them.

### Run it

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

`pnpm mcp:smoke` mints a fresh token (via `mint-test-token.mjs`, defaulting to the
`active@staging.test` user), performs the MCP `initialize` handshake, and runs
`tools/list` (default) or `tools/call`, printing the tool result as JSON. Token
overrides: `MCP_TEST_EMAIL`, `MCP_TEST_API_KEY`, `STAGING_TEST_PASSWORD` — all readable
from `.env.local`. Mint a token alone with `pnpm mcp:token`.

> **Project match.** The token's Firebase project must equal the project the running
> server's Admin SDK verifies against. Keeping both on staging in `.env.local` (above)
> satisfies this; a mismatch is the most common testing 401.

## Preview loop (deployed-artifact validation)

Labelling the PR **`ready for UAT`** deploys a preview (`Preview Deploy` workflow) and
posts the URL as a sticky comment. Testing the deployed MCP endpoint has two extra
requirements that the local loop avoids:

- **Preview env parity (admin credentials).** The Preview environment must carry the
  staging **admin** credentials (`FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`) that
  `admin.ts` reads. Vercel currently stores a `FIREBASE_SERVICE_ACCOUNT` for Production
  only; syncing the staging service account into Preview as the vars `admin.ts` expects
  is the env tooling's (`envctl`) job. Until that lands, the deployed MCP returns 401 on
  every call regardless of the token.
- **Deployment protection.** Previews sit behind Vercel Authentication (an SSO wall). Use
  the caller's Vercel auth rather than disabling protection: `vercel curl` reaches a
  protected deployment with automatic bypass (needs a current Vercel CLI — the `curl`
  subcommand in older CLIs does not forward `-H`/`-X`). For the scripted client, set
  `VERCEL_AUTOMATION_BYPASS_SECRET` (Protection Bypass for Automation) and
  `mcp-smoke.mjs` sends it as `x-vercel-protection-bypass` automatically:

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<secret> pnpm mcp:smoke --url https://<preview-host>/api/mcp call list_ledgers
```

A quick reachability check that needs no bypass secret (current CLI):

```bash
vercel curl https://<preview-host>/api/mcp -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream"
```

An app `401 invalid_token` (rather than the Vercel SSO page) means protection was
bypassed and the MCP route was reached.

## Troubleshooting

- **401 Unauthorized** — token expired (mint a fresh one), the server's admin creds are
  for a different Firebase project than the token (project mismatch), or (on a preview)
  the Preview env has no staging admin credentials yet.
- **Vercel SSO / protection page** — the request did not use an accepted auth path; use
  `vercel curl` or the bypass secret.
- **`tools/list` empty** — the server built without the tools registered; check the
  deploy logs.

## Scripts

- [`scripts/mint-test-token.mjs`](../scripts/mint-test-token.mjs) — mint a staging ID
  token (`pnpm mcp:token`); also `import { mintTestToken }` for reuse.
- [`scripts/mcp-smoke.mjs`](../scripts/mcp-smoke.mjs) — MCP Streamable-HTTP client
  (`pnpm mcp:smoke`).
