import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

/**
 * Allocates a deposit amount across savings goals using Zipf-weighted
 * distribution. The goal with priority 1 receives the largest share (weight 1),
 * priority 2 receives half (weight 1/2), priority 3 receives a third (weight
 * 1/3), and so on. All weights are normalised so the shares sum to 1.
 *
 * The deposit amount is treated as an integer number of the smallest currency
 * unit (e.g. cents). Fractional cents are distributed using probabilistic
 * rounding: extra pennies are assigned to goals by weighted random draw
 * proportional to each goal's fractional allocation, without replacement, so
 * the total always exactly equals `depositAmountCents`.
 *
 * @param goals - The goals to allocate the deposit across. Order does not
 *   matter — shares are determined by each goal's `priority` field.
 * @param depositAmountCents - The total deposit in the smallest currency unit.
 * @param random - Optional seeded random function (defaults to `Math.random`).
 *   Injected for deterministic testing.
 * @returns A map from goal ID to the integer cents allocated to that goal.
 */
export function allocateDeposit(
  goals: BudgetLedgerSavingsGoal[],
  depositAmountCents: number,
  random: () => number = Math.random,
): Record<string, number> {
  if (goals.length === 0) return {};

  const harmonic = goals.reduce((sum, g) => sum + 1 / g.priority, 0);

  interface GoalAlloc {
    frac: number;
    floor: number;
    id: string;
  }

  const allocs: GoalAlloc[] = goals.map((g) => {
    const exact = (depositAmountCents * (1 / g.priority)) / harmonic;
    const floor = Math.floor(exact);
    return { id: g.id, floor, frac: exact - floor };
  });

  const totalFloor = allocs.reduce((s, a) => s + a.floor, 0);
  const extraPennies = depositAmountCents - totalFloor;

  // Distribute extra pennies using weighted random sampling without replacement.
  // Each goal's probability of receiving a bonus cent is proportional to its
  // fractional allocation remainder.
  const bonuses = new Set<string>();
  const remaining = allocs.filter((a) => a.frac > 0);

  for (let i = 0; i < extraPennies; i++) {
    const totalFrac = remaining.reduce((s, a) => s + a.frac, 0);
    let threshold = random() * totalFrac;
    for (let j = 0; j < remaining.length; j++) {
      const candidate = remaining[j];
      if (candidate === undefined) break;
      threshold -= candidate.frac;
      if (threshold <= 0) {
        bonuses.add(candidate.id);
        remaining.splice(j, 1);
        break;
      }
    }
  }

  return Object.fromEntries(
    allocs.map((a) => [a.id, a.floor + (bonuses.has(a.id) ? 1 : 0)]),
  );
}
