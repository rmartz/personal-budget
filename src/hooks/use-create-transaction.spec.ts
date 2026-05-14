import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";
import * as transactionsService from "@/services/transactions";

import { useCreateTransaction } from "./use-create-transaction";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("useCreateTransaction", () => {
  describe("calls createTransaction with the uid, ledgerId, and expense data", () => {
    it("passes uid, ledgerId, and formatted expense to createTransaction", async () => {
      const spy = vi
        .spyOn(transactionsService, "createTransaction")
        .mockResolvedValue({
          id: "tx-id",
          ledgerId: "ledger-abc",
          type: BudgetLedgerTransactionType.Expense,
          date: new Date("2024-03-15T00:00:00"),
          amount: 42.5,
          description: "Groceries",
        });

      const { result } = renderHook(() =>
        useCreateTransaction("uid-123", "ledger-abc"),
      );

      await act(async () => {
        await result.current.addExpense({
          date: new Date("2024-03-15T00:00:00"),
          amount: 42.5,
          description: "Groceries",
        });
      });

      expect(spy).toHaveBeenCalledWith("uid-123", "ledger-abc", {
        type: BudgetLedgerTransactionType.Expense,
        date: new Date("2024-03-15T00:00:00"),
        amount: 42.5,
        description: "Groceries",
      });
    });
  });

  describe("throws when uid is empty", () => {
    it("throws and does not call createTransaction when uid is an empty string", async () => {
      const spy = vi.spyOn(transactionsService, "createTransaction");

      const { result } = renderHook(() =>
        useCreateTransaction("", "ledger-abc"),
      );

      await expect(
        act(async () => {
          await result.current.addExpense({
            date: new Date("2024-03-15T00:00:00"),
            amount: 10,
            description: "Test",
          });
        }),
      ).rejects.toThrow("Cannot create transaction: missing uid or ledgerId");

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
