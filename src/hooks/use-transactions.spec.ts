import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { useTransactions } from "./use-transactions";
import { BudgetLedgerTransactionType } from "@/lib/firebase/schema/budget-ledger-transactions";

const mockUnsubscribe = vi.fn();
const mockOnValue = vi.fn();

vi.mock("firebase/database", () => ({
  getDatabase: vi.fn(() => ({ type: "mock-db" })),
  ref: vi.fn(() => ({ type: "mock-ref" })),
  onValue: (
    ...args: Parameters<typeof mockOnValue>
  ): ReturnType<typeof mockOnValue> => mockOnValue(...args),
}));

vi.mock("@/lib/firebase/client", () => ({
  getClientApp: vi.fn(() => ({ name: "mock-app" })),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useTransactions", () => {
  describe("empty guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useTransactions("", "ledger-1"));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("does not subscribe when ledgerId is empty", () => {
      renderHook(() => useTransactions("uid-1", ""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns an empty array when uid is empty", () => {
      const { result } = renderHook(() => useTransactions("", "ledger-1"));
      expect(result.current.transactions).toEqual([]);
    });
  });

  describe("subscription", () => {
    it("returns empty array when snapshot has no data", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({ exists: () => false });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useTransactions("uid-1", "ledger-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.transactions).toEqual([]);
    });

    it("maps snapshot data to BudgetLedgerTransaction objects", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({
              "tx-1": {
                type: BudgetLedgerTransactionType.Expense,
                date: "2024-03-01T00:00:00.000Z",
                amount: 50,
                description: "Coffee",
              },
            }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useTransactions("uid-1", "ledger-1"));

      await waitFor(() => {
        expect(result.current.transactions).toHaveLength(1);
      });

      expect(result.current.transactions[0]).toMatchObject({
        id: "tx-1",
        ledgerId: "ledger-1",
        type: BudgetLedgerTransactionType.Expense,
        amount: 50,
        description: "Coffee",
      });
      expect(result.current.transactions[0]!.date).toBeInstanceOf(Date);
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);
      const { unmount } = renderHook(() =>
        useTransactions("uid-1", "ledger-1"),
      );
      unmount();
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it("sets error when onValue calls the error callback", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, _cb: unknown, errCb: (err: Error) => void) => {
          errCb(new Error("permission denied"));
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useTransactions("uid-1", "ledger-1"));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error!.message).toBe("permission denied");
    });
  });
});
