---
type: Guide
title: Testing the MCP server
description: The MCP staging test process — provision staging with envctl, then exercise the MCP tools against the staging Firebase project from a Claude Code session or the CLI, with no manually-handled secrets.
resource: scripts/mcp-smoke.mjs
tags: [mcp, testing, uat, staging, firebase, preview, envctl]
---

# Testing the MCP server

The MCP server (`/api/mcp`) authenticates each request with a **Firebase ID token as
`Bearer`** (Phase 1 — see epic #442). The test harness obtains that token with the
staging **Admin SDK** (a custom token exchanged for an ID token), so **no test-user
password is involved** — and all the staging secrets are provisioned and pulled by
`envctl`, never handled by hand. The intended workflow is to **ask a Claude Code session
to test behavior**, which it does by running the `pnpm` scripts below.

Every MCP tool corresponds to a UI action (MCP ⊆ UI): the ledger tools map to the
ledgers pages' list/create/edit/delete, and validating a tool exercises the same shared
server data layer (`src/server/data/*`) the UI calls.

## One-time setup (tooling-driven, no manual secrets)

All from a checkout where `staging` is an active environment (this branch / `main`):

```bash
# 1. Provision the staging Firebase admin credential into the preview env (mints a
#    key + redeploys). Cold-start needs the staging service-account email once:
FIREBASE_SA_EMAIL="firebase-adminsdk-fbsvc@personal-budget-staging-a99af.iam.gserviceaccount.com" \
  envctl secrets init firebase --env staging
```

```bash
# 2. Pull the staging env into .env.local (admin creds + public config; 0600, gitignored)
envctl config pull --env staging --force
```

```bash
# 3. Seed the staging test users + data (idempotent; needs no password)
node --env-file-if-exists=.env.local scripts/seed-staging.mjs
```

`config pull` materializes everything the server and scripts need (`FIREBASE_PROJECT_ID`
/ `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` for the admin SDK, plus the public
`NEXT_PUBLIC_FIREBASE_*`), so the private key is written and read by tooling only. Both
`pnpm dev` and the `mcp:*` scripts load `.env.local` (the scripts via Node's
`--env-file-if-exists`).

> If `config push` ever reports "Updated" but a pulled value stays empty, that's
> envctl #124 (update no-op) — `vercel env rm <var> <target> --yes` the stale entry and
> `config push` again to re-create it.

## Run it

```bash
pnpm dev
```

```bash
pnpm mcp:smoke                                   # list the tools
```

```bash
pnpm mcp:smoke call list_ledgers                 # a read tool
```

```bash
pnpm mcp:smoke call create_ledger '{"name":"Test","cashCap":500}'
```

`pnpm mcp:smoke` mints a fresh ID token (via `mint-test-token.mjs` — Admin SDK custom
token for `active@staging.test` by default), performs the MCP `initialize` handshake,
and runs `tools/list` (default) or `tools/call`, printing the result as JSON. Overrides:
`MCP_TEST_EMAIL`, `MCP_TEST_API_KEY` (both read from `.env.local`). Mint a token alone
with `pnpm mcp:token`. ID tokens last ~1h, so mint fresh per session.

> **Project match.** The token's Firebase project must equal the project the running
> server's Admin SDK verifies against. Keeping both on staging (via `config pull`)
> satisfies this; a mismatch is the most common testing 401.

## Preview loop (deployed-artifact validation)

Labelling the PR **`ready for UAT`** deploys a preview and posts the URL as a sticky
comment. The deployed MCP works once the preview env has the staging admin credential
(step 1 above provisions it). One extra hurdle vs. local:

- **Deployment protection.** Previews sit behind Vercel Authentication (an SSO wall). Use
  the caller's Vercel auth rather than disabling protection: `vercel curl` reaches a
  protected deployment with automatic bypass (needs a current Vercel CLI). For the
  scripted client, set `VERCEL_AUTOMATION_BYPASS_SECRET` (Protection Bypass for
  Automation) and `mcp-smoke.mjs` sends it as `x-vercel-protection-bypass` automatically:

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<secret> pnpm mcp:smoke --url https://<preview-host>/api/mcp call list_ledgers
```

## Troubleshooting

- **`There is no user record …`** — the staging test users aren't seeded; run step 3.
- **401 Unauthorized** — token expired (mint fresh), a project mismatch between the token
  and the server's admin creds, or (on a preview) the admin credential isn't provisioned.
- **Vercel SSO / protection page** — the request didn't use an accepted auth path; use
  `vercel curl` or the bypass secret.
- **`tools/list` empty** — the server built without the tools registered; check the logs.

## Scripts

- [`scripts/mint-test-token.mjs`](../scripts/mint-test-token.mjs) — mint a staging ID
  token via the Admin SDK custom-token exchange (`pnpm mcp:token`); also
  `import { mintTestToken }` for reuse.
- [`scripts/mcp-smoke.mjs`](../scripts/mcp-smoke.mjs) — MCP Streamable-HTTP client
  (`pnpm mcp:smoke`).
- [`scripts/seed-staging.mjs`](../scripts/seed-staging.mjs) — seed the staging test users
  and data (see [Staging Test Accounts](staging-test-accounts.md)).
