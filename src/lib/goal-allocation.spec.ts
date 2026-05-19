import { describe, expect, it } from "vitest";

import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { allocateDeposit } from "./goal-allocation";

function makeGoal(
  overrides: Partial<BudgetLedgerSavingsGoal> = {},
): BudgetLedgerSavingsGoal {
  return {
    id: "goal-1",
    ledgerId: "ledger-1",
    name: "Test Goal",
    targetAmount: 1000,
    fundedAmount: 0,
    priority: 1,
    ...overrides,
  };
}

describe("allocateDeposit — empty goals", () => {
  it("returns an empty object when there are no goals", () => {
    const result = allocateDeposit([], 500);
    expect(Object.keys(result)).toHaveLength(0);
  });
});

describe("allocateDeposit — zero deposit", () => {
  it("allocates 0 to each goal when deposit is 0", () => {
    const goals = [
      makeGoal({ id: "g1", priority: 1 }),
      makeGoal({ id: "g2", priority: 2 }),
    ];
    const result = allocateDeposit(goals, 0);
    expect(result["g1"]).toBe(0);
    expect(result["g2"]).toBe(0);
  });
});

describe("allocateDeposit — single goal receives the full deposit", () => {
  it("gives the single goal the entire deposit", () => {
    const goal = makeGoal({ id: "g1", priority: 1 });
    const result = allocateDeposit([goal], 500);
    expect(result["g1"]).toBe(500);
  });

  it("gives the single goal the full amount regardless of priority value", () => {
    const goal = makeGoal({ id: "g1", priority: 3 });
    const result = allocateDeposit([goal], 300);
    expect(result["g1"]).toBe(300);
  });
});

describe("allocateDeposit — Zipf-weighted shares", () => {
  it("gives priority-1 goal a larger share than priority-2 goal", () => {
    const goal1 = makeGoal({ id: "g1", priority: 1 });
    const goal2 = makeGoal({ id: "g2", priority: 2 });
    const result = allocateDeposit([goal1, goal2], 300);
    expect(result["g1"]!).toBeGreaterThan(result["g2"]!);
  });

  it("gives exactly correct integer allocations when the deposit divides evenly", () => {
    // Zipf with priorities 1 and 2: harmonic = 1 + 0.5 = 1.5
    // shares = 2/3 and 1/3
    // 300 cents: g1 gets 200, g2 gets 100 exactly — no rounding needed
    const goal1 = makeGoal({ id: "g1", priority: 1 });
    const goal2 = makeGoal({ id: "g2", priority: 2 });
    const result = allocateDeposit([goal1, goal2], 300);
    expect(result["g1"]).toBe(200);
    expect(result["g2"]).toBe(100);
  });

  it("scales share correctly across three Zipf-weighted goals with even division", () => {
    // harmonic = 1 + 1/2 + 1/3 = 11/6
    // shares ≈ 0.545, 0.273, 0.182
    // 110 cents: g1 ≈ 60, g2 ≈ 30, g3 ≈ 20 — check g1 > g2 > g3
    const goal1 = makeGoal({ id: "g1", priority: 1 });
    const goal2 = makeGoal({ id: "g2", priority: 2 });
    const goal3 = makeGoal({ id: "g3", priority: 3 });
    const result = allocateDeposit([goal1, goal2, goal3], 110);
    expect(result["g1"]!).toBeGreaterThan(result["g2"]!);
    expect(result["g2"]!).toBeGreaterThan(result["g3"]!);
  });
});

describe("allocateDeposit — total always equals the deposit amount", () => {
  it("sums to the deposit amount for two goals with a fractional remainder", () => {
    // 100 cents with priorities 1 and 2: exact = 66.67 and 33.33 — 1 extra penny
    const goals = [
      makeGoal({ id: "g1", priority: 1 }),
      makeGoal({ id: "g2", priority: 2 }),
    ];
    const deposit = 100;
    const result = allocateDeposit(goals, deposit, () => 0);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBe(deposit);
  });

  it("sums to the deposit amount for three Zipf-weighted goals", () => {
    const goals = [
      makeGoal({ id: "g1", priority: 1 }),
      makeGoal({ id: "g2", priority: 2 }),
      makeGoal({ id: "g3", priority: 3 }),
    ];
    const deposit = 100;
    const result = allocateDeposit(goals, deposit, () => 0);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBe(deposit);
  });

  it("sums to the deposit for a large awkward amount", () => {
    const goals = [
      makeGoal({ id: "g1", priority: 1 }),
      makeGoal({ id: "g2", priority: 2 }),
      makeGoal({ id: "g3", priority: 3 }),
    ];
    const deposit = 999;
    const result = allocateDeposit(goals, deposit, () => 0.5);
    const total = Object.values(result).reduce((s, v) => s + v, 0);
    expect(total).toBe(deposit);
  });
});

describe("allocateDeposit — probabilistic penny rounding", () => {
  it("rounds up the goal with the highest fractional remainder when random returns 0", () => {
    // Priorities 1 and 2: exact = 66.666... and 33.333...
    // floors: g1=66, g2=33 → extraPennies=1
    // fracs: g1≈0.667 (larger), g2≈0.333
    // random()=0 → threshold=0, iteration subtracts g1.frac first → g1 wins
    const goal1 = makeGoal({ id: "g1", priority: 1 });
    const goal2 = makeGoal({ id: "g2", priority: 2 });
    const result = allocateDeposit([goal1, goal2], 100, () => 0);
    expect(result["g1"]).toBe(67);
    expect(result["g2"]).toBe(33);
  });

  it("each allocation is a non-negative integer", () => {
    const goals = [
      makeGoal({ id: "g1", priority: 1 }),
      makeGoal({ id: "g2", priority: 2 }),
      makeGoal({ id: "g3", priority: 3 }),
    ];
    const result = allocateDeposit(goals, 100, () => 0.5);
    for (const cents of Object.values(result)) {
      expect(cents).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(cents)).toBe(true);
    }
  });
});
