import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// The seed script is plain JS run as a subprocess (matching the repo's other
// script specs). Its pure output is inspected via the `--dump-profiles` flag,
// and its production guard is exercised by running it with different env.
const SCRIPT_PATH = join(process.cwd(), "scripts", "seed-staging.mjs");

// Env with the seed-relevant vars stripped, so a developer's real credentials
// never leak into these tests (the guard/password checks run before any Firebase
// call, so no test ever touches the network).
function cleanEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  delete env["FIREBASE_PROJECT_ID"];
  delete env["STAGING_TEST_PASSWORD"];
  return env;
}

function run(args: string[], env: NodeJS.ProcessEnv) {
  return spawnSync("node", [SCRIPT_PATH, ...args], { env, encoding: "utf8" });
}

// Firebase-shaped profile types (mirror docs/database-schema.md) for typed
// assertions against the dumped JSON.
interface Ledger {
  name: string;
  cashCap?: number;
}
interface Transaction {
  type: string;
  date: string;
  amount: number;
  description: string;
}
interface Goal {
  name: string;
  targetAmount: number;
  fundedAmount: number;
  priority: number;
}
interface Annuity {
  name: string;
  monthlyAmount: number;
  startDate: string;
}
interface ReconciliationAccount {
  tier: string;
  targetFloat: number;
}
interface ReconciliationExpense {
  type: string;
  typicalAmount: number;
}
interface ProfileSubtree {
  budgetLedgers?: Record<string, Ledger>;
  budgetLedgerTransactions?: Record<string, Record<string, Transaction>>;
  budgetLedgerSavingsGoals?: Record<string, Record<string, Goal>>;
  annuities?: Record<string, Annuity>;
  reconciliationAccounts?: Record<string, ReconciliationAccount>;
  reconciliationExpenses?: Record<string, ReconciliationExpense>;
}
type Profiles = Record<"new" | "active" | "edge", ProfileSubtree>;

function dumpProfiles(): Profiles {
  const result = run(["--dump-profiles"], cleanEnv());
  expect(result.status).toBe(0);
  return JSON.parse(result.stdout) as Profiles;
}

describe("seed-staging — refuses to run against non-staging projects", () => {
  it("aborts when FIREBASE_PROJECT_ID is not a staging project", () => {
    const result = run([], {
      ...cleanEnv(),
      FIREBASE_PROJECT_ID: "personal-budget-prod",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("staging");
  });

  it("aborts when FIREBASE_PROJECT_ID is unset", () => {
    const result = run([], cleanEnv());
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("staging");
  });

  it("aborts on a staging project when STAGING_TEST_PASSWORD is missing", () => {
    const result = run([], {
      ...cleanEnv(),
      FIREBASE_PROJECT_ID: "personal-budget-staging-a99af",
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("STAGING_TEST_PASSWORD");
  });
});

describe("seed-staging — profiles cover empty, rich, and edge-case accounts", () => {
  it("gives the new-user account an empty profile", () => {
    expect(Object.keys(dumpProfiles().new)).toHaveLength(0);
  });

  it("gives the active account ledgers, transactions, goals, and annuities", () => {
    const active = dumpProfiles().active;
    expect(Object.keys(active.budgetLedgers ?? {}).length).toBeGreaterThan(0);
    expect(
      Object.keys(active.budgetLedgerTransactions ?? {}).length,
    ).toBeGreaterThan(0);
    expect(
      Object.keys(active.budgetLedgerSavingsGoals ?? {}).length,
    ).toBeGreaterThan(0);
    expect(Object.keys(active.annuities ?? {}).length).toBeGreaterThan(0);
  });

  it("gives the edge account a fully-funded goal and a cash-capped ledger", () => {
    const edge = dumpProfiles().edge;
    const goals = Object.values(edge.budgetLedgerSavingsGoals ?? {}).flatMap(
      (byGoal) => Object.values(byGoal),
    );
    expect(goals.some((g) => g.fundedAmount === g.targetAmount)).toBe(true);
    const ledgers = Object.values(edge.budgetLedgers ?? {});
    expect(ledgers.some((l) => typeof l.cashCap === "number")).toBe(true);
  });
});

describe("seed-staging — data matches the Firebase schema", () => {
  it("shapes ledgers, transactions, goals, annuities, and reconciliation records per schema", () => {
    const profiles = dumpProfiles();
    for (const profile of [profiles.active, profiles.edge]) {
      for (const ledger of Object.values(profile.budgetLedgers ?? {})) {
        expect(typeof ledger.name).toBe("string");
      }
      for (const byTx of Object.values(
        profile.budgetLedgerTransactions ?? {},
      )) {
        for (const tx of Object.values(byTx)) {
          expect(["deposit", "expense"]).toContain(tx.type);
          expect(typeof tx.amount).toBe("number");
        }
      }
      for (const byGoal of Object.values(
        profile.budgetLedgerSavingsGoals ?? {},
      )) {
        for (const goal of Object.values(byGoal)) {
          expect(typeof goal.targetAmount).toBe("number");
          expect(typeof goal.fundedAmount).toBe("number");
          expect(typeof goal.priority).toBe("number");
        }
      }
      for (const annuity of Object.values(profile.annuities ?? {})) {
        expect(typeof annuity.monthlyAmount).toBe("number");
        expect(typeof annuity.startDate).toBe("string");
      }
      for (const account of Object.values(
        profile.reconciliationAccounts ?? {},
      )) {
        expect(["short-term", "reserve", "long-term"]).toContain(account.tier);
      }
      for (const expense of Object.values(
        profile.reconciliationExpenses ?? {},
      )) {
        expect(["statement-balance", "running-balance"]).toContain(
          expense.type,
        );
      }
    }
  });

  it("is deterministic so re-running upserts identical nodes (no duplicates)", () => {
    expect(dumpProfiles()).toEqual(dumpProfiles());
  });
});
