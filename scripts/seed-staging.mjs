#!/usr/bin/env node
/**
 * Seed the STAGING Firebase project with a small set of email/password test
 * users, each carrying a distinct, recognizable data profile so preview testing
 * (and the account switcher in #321) exercises realistic states.
 *
 * Safety: the script refuses to run unless FIREBASE_PROJECT_ID names a staging
 * project (must contain "staging"), so it can never touch production. The
 * separate staging Firebase project (#319) is the real safety boundary.
 *
 * Idempotent: profiles use deterministic child keys and each user's subtree is
 * written with a single `set()` at `/users/{uid}`, so re-running upserts the
 * same nodes rather than duplicating — and resets the account to a known state.
 *
 * Required env (staging service account + RTDB; same vars as src/lib/firebase/admin.ts):
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY,
 *   FIREBASE_DATABASE_URL, and STAGING_TEST_PASSWORD (shared test password).
 *
 * Run: node scripts/seed-staging.mjs   (see docs/staging-test-accounts.md)
 *
 * Data shapes match docs/database-schema.md exactly (Firebase layer).
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

const STAGING_MARKER = "staging";

// Staging-only accounts. Emails use the non-routable `.test` TLD so they can
// never collide with a real user; the password comes from env, never hardcoded.
const TEST_ACCOUNTS = [
  {
    key: "new",
    email: "new-user@staging.test",
    label: "New user",
    description: "No data — the first-run empty state.",
  },
  {
    key: "active",
    email: "active@staging.test",
    label: "Active user",
    description:
      "Multiple ledgers, transactions, goals, an annuity, and reconciliation setup.",
  },
  {
    key: "edge",
    email: "edge@staging.test",
    label: "Edge cases",
    description:
      "A fully-funded goal and a cash-capped ledger for boundary testing.",
  },
];

/**
 * Throw unless `projectId` names a staging project. This is the production
 * guard: a production project id will not contain "staging", so seeding aborts.
 */
function assertStagingProject(projectId) {
  if (!projectId || !projectId.includes(STAGING_MARKER)) {
    throw new Error(
      `Refusing to seed: FIREBASE_PROJECT_ID (${projectId ? `"${projectId}"` : "unset"}) is not a staging project — it must contain "${STAGING_MARKER}". This guard prevents seeding production.`,
    );
  }
  return projectId;
}

/**
 * The per-account data subtrees, keyed by account `key`, shaped exactly as the
 * Firebase layer stores them under `/users/{uid}/` (see docs/database-schema.md).
 * Deterministic keys + fixed timestamps keep re-runs byte-identical.
 */
function buildProfiles() {
  return {
    new: {},
    active: {
      budgetLedgers: {
        "car-maintenance": { name: "Car Maintenance", cashCap: 2000 },
        "emergency-fund": { name: "Emergency Fund" },
      },
      budgetLedgerTransactions: {
        "car-maintenance": {
          "tx-1": {
            type: "deposit",
            date: "2026-01-05T00:00:00.000Z",
            amount: 300,
            description: "Monthly set-aside",
          },
          "tx-2": {
            type: "expense",
            date: "2026-02-14T00:00:00.000Z",
            amount: 180,
            description: "Oil change + tires",
          },
        },
        "emergency-fund": {
          "tx-1": {
            type: "deposit",
            date: "2026-01-01T00:00:00.000Z",
            amount: 1500,
            description: "Initial funding",
          },
        },
      },
      budgetLedgerSavingsGoals: {
        "emergency-fund": {
          "three-month-buffer": {
            name: "Three-month buffer",
            targetAmount: 9000,
            fundedAmount: 1500,
            priority: 1,
          },
          vacation: {
            name: "Vacation",
            targetAmount: 3000,
            fundedAmount: 500,
            priority: 2,
          },
        },
      },
      annuities: {
        netflix: {
          name: "Netflix",
          monthlyAmount: 15.49,
          startDate: "2025-06-01T00:00:00.000Z",
          durationMonths: null,
        },
        "car-loan": {
          name: "Car Loan",
          monthlyAmount: 420,
          startDate: "2024-09-01T00:00:00.000Z",
          durationMonths: 60,
        },
      },
      reconciliationAccounts: {
        "chase-checking": {
          name: "Chase Checking",
          tier: "short-term",
          targetFloat: 2500,
        },
        "ally-savings": {
          name: "Ally Savings",
          tier: "reserve",
          targetFloat: 10000,
        },
      },
      reconciliationExpenses: {
        electric: {
          name: "Electric Bill",
          type: "statement-balance",
          typicalAmount: 120,
        },
        rent: {
          name: "Rent",
          type: "running-balance",
          typicalAmount: 1800,
        },
      },
    },
    edge: {
      budgetLedgers: {
        "capped-savings": { name: "Capped Savings", cashCap: 500 },
      },
      budgetLedgerSavingsGoals: {
        "capped-savings": {
          "fully-funded": {
            name: "Fully-funded goal",
            targetAmount: 1200,
            fundedAmount: 1200,
            priority: 1,
          },
        },
      },
    },
  };
}

async function ensureUser(auth, email, password) {
  try {
    const user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password, emailVerified: true });
    return user.uid;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      const created = await auth.createUser({
        email,
        password,
        emailVerified: true,
      });
      return created.uid;
    }
    throw error;
  }
}

async function main() {
  const projectId = assertStagingProject(process.env["FIREBASE_PROJECT_ID"]);
  const password = process.env["STAGING_TEST_PASSWORD"];
  if (!password) {
    throw new Error("STAGING_TEST_PASSWORD is required to seed test accounts.");
  }

  const app =
    getApps().find((a) => a.name === "[DEFAULT]") ??
    initializeApp({
      credential: cert({
        projectId,
        clientEmail: process.env["FIREBASE_CLIENT_EMAIL"],
        privateKey: process.env["FIREBASE_PRIVATE_KEY"]?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env["FIREBASE_DATABASE_URL"],
    });

  const auth = getAuth(app);
  const db = getDatabase(app);
  const profiles = buildProfiles();

  for (const account of TEST_ACCOUNTS) {
    const uid = await ensureUser(auth, account.email, password);
    // Full-subtree set = deterministic upsert; resets the account to its profile.
    await db.ref(`/users/${uid}`).set(profiles[account.key]);
    console.log(`Seeded ${account.email} (${account.label}) → uid ${uid}`);
  }

  console.log(`Done. Seeded ${TEST_ACCOUNTS.length} staging test account(s).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // `--dump-profiles` prints the profile data as JSON and exits without touching
  // Firebase — used by the test suite to assert the seed shapes.
  if (process.argv.includes("--dump-profiles")) {
    console.log(JSON.stringify(buildProfiles(), null, 2));
    process.exit(0);
  }
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
