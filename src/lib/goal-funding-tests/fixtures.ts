import {
  type BudgetLedgerTransaction,
  BudgetLedgerTransactionType,
} from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

export function makeTransaction(
  overrides: Partial<BudgetLedgerTransaction> = {},
): BudgetLedgerTransaction {
  return {
    id: "tx-1",
    ledgerId: "ledger-1",
    type: BudgetLedgerTransactionType.Deposit,
    date: new Date("2025-01-01"), // Jan 1, 2025 UTC midnight (matches production)
    amount: 500,
    description: "Test deposit",
    ...overrides,
  };
}

export function makeGoal(
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

// Reference date used across tests for determinism (local Jun 1, 2025)
export const REF_DATE = new Date(2025, 5, 1);
