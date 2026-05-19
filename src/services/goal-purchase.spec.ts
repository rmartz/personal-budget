import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("firebase/database", () => ({
  getDatabase: vi.fn(),
  push: vi.fn(),
  ref: vi.fn(),
  remove: vi.fn(),
  runTransaction: vi.fn(),
  set: vi.fn(),
}));

vi.mock("@/lib/firebase/client", () => ({
  getClientApp: vi.fn(() => ({ name: "mock-app" })),
}));

import { getDatabase, push, ref, set } from "firebase/database";

import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import type { BudgetLedgerSavingsGoal } from "@/lib/firebase/schema/savings-goals";

import { purchaseGoal } from "./goal-purchase";

const mockDb = { type: "mock-db" };
const mockRef = { type: "mock-ref" };

function makeGoal(
  overrides: Partial<BudgetLedgerSavingsGoal> = {},
): BudgetLedgerSavingsGoal {
  return {
    id: "goal-1",
    ledgerId: "ledger-1",
    name: "New Laptop",
    targetAmount: 1500,
    fundedAmount: 1500,
    priority: 1,
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(getDatabase).mockReturnValue(mockDb as never);
  vi.mocked(ref).mockReturnValue(mockRef as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("purchaseGoal", () => {
  describe("creates an expense transaction on the goal's ledger", () => {
    it("pushes a transaction with type Expense to firebase", async () => {
      const newRef = { key: "txn-new" };
      vi.mocked(push).mockReturnValue(newRef as never);
      vi.mocked(set).mockResolvedValue(undefined);

      const goal = makeGoal({ ledgerId: "ledger-abc" });
      const purchaseDate = new Date("2024-06-15T00:00:00.000Z");

      await purchaseGoal("uid-1", goal, {
        amount: 1499.99,
        date: purchaseDate,
        description: "Studio Display",
      });

      const setCall = vi.mocked(set).mock.calls[0] ?? [];
      const payload = setCall[1] as {
        type: string;
        amount: number;
        date: string;
        description: string;
      };
      expect(payload.type).toBe(BudgetLedgerTransactionType.Expense);
      expect(payload.amount).toBe(1499.99);
      expect(payload.date).toBe(purchaseDate.toISOString());
      expect(payload.description).toBe("Studio Display");
    });

    it("writes the transaction to the goal's ledger path", async () => {
      const newRef = { key: "txn-new" };
      vi.mocked(push).mockReturnValue(newRef as never);
      vi.mocked(set).mockResolvedValue(undefined);

      const goal = makeGoal({ ledgerId: "ledger-xyz" });

      await purchaseGoal("uid-1", goal, {
        amount: 500,
        date: new Date("2024-01-01T00:00:00.000Z"),
        description: "Vacation",
      });

      expect(ref).toHaveBeenCalledWith(
        mockDb,
        "users/uid-1/budgetLedgerTransactions/ledger-xyz",
      );
    });
  });

  describe("removes the savings goal after recording the expense", () => {
    it("calls runTransaction to delete and reorder the goal", async () => {
      const { runTransaction } = await import("firebase/database");

      const newRef = { key: "txn-new" };
      vi.mocked(push).mockReturnValue(newRef as never);
      vi.mocked(set).mockResolvedValue(undefined);
      vi.mocked(runTransaction).mockResolvedValue(undefined as never);

      const goal = makeGoal({ id: "goal-1", ledgerId: "ledger-1" });

      await purchaseGoal("uid-1", goal, {
        amount: 1500,
        date: new Date("2024-06-01T00:00:00.000Z"),
        description: "New laptop",
      });

      expect(runTransaction).toHaveBeenCalled();
    });
  });
});
