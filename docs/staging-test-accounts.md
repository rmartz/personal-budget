---
type: Guide
title: Staging Test Accounts
description: The seeded email/password test users in the staging Firebase project and how to (re-)seed them.
resource: scripts/seed-staging.mjs
tags: [staging, testing, firebase, seed, preview]
---

# Staging Test Accounts

`scripts/seed-staging.mjs` seeds a small set of email/password test users into the
**staging** Firebase project, each with a distinct, recognizable data profile so
preview/staging testing (and the account switcher, #321) exercises realistic
states. It never touches production — see [Safety](#safety).

## Accounts

| Email                   | Profile                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `new-user@staging.test` | **New user** — no data; the first-run empty state.                                                                                       |
| `active@staging.test`   | **Active user** — two ledgers (one cash-capped), transactions, two savings goals, two annuities, and reconciliation accounts + expenses. |
| `edge@staging.test`     | **Edge cases** — a fully-funded goal (`fundedAmount == targetAmount`) and a cash-capped ledger.                                          |

All three share one password, supplied via `STAGING_TEST_PASSWORD` (below). The
data shapes match the [Firebase Realtime Database Schema](database-schema.md).

## Running the seed

The script uses the Firebase Admin SDK against the staging project. Provide the
staging service-account credentials and the shared test password as environment
variables (the Firebase vars are the same ones `src/lib/firebase/admin.ts` reads):

```bash
export FIREBASE_PROJECT_ID="personal-budget-staging-…"   # must contain "staging"
export FIREBASE_CLIENT_EMAIL="…@…iam.gserviceaccount.com"
export FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n…"
export FIREBASE_DATABASE_URL="https://personal-budget-staging-…-default-rtdb.firebaseio.com"
export STAGING_TEST_PASSWORD="<staging-only password>"

node scripts/seed-staging.mjs
```

Each account is created if missing (its password is (re)set on every run), then
its `/users/{uid}` subtree is written with a single `set()`.

## Idempotency

Re-running is safe: profiles use deterministic child keys and each user's subtree
is written with one `set()`, so a re-run upserts the same nodes rather than
duplicating — and resets the account to its known profile (any manual edits made
while testing are overwritten).

## Safety

The script **refuses to run** unless `FIREBASE_PROJECT_ID` names a staging
project (its id must contain `"staging"`), so it can never seed production. The
separate staging Firebase project (#319) is the real safety boundary; the emails
use the non-routable `.test` TLD and the password comes only from
`STAGING_TEST_PASSWORD` — no production credentials are ever referenced.
