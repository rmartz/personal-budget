import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ReconciliationExpenseType } from "@/lib/firebase/schema/reconciliation-expenses";

import { useReconciliationExpenses } from "./use-reconciliation-expenses";

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

describe("useReconciliationExpenses", () => {
  describe("empty guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useReconciliationExpenses(""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns an empty array when uid is empty", () => {
      const { result } = renderHook(() => useReconciliationExpenses(""));
      expect(result.current.reconciliationExpenses).toEqual([]);
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

      const { result } = renderHook(() => useReconciliationExpenses("uid-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.reconciliationExpenses).toEqual([]);
    });

    it("maps snapshot data to ReconciliationExpense objects", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({
              "expense-1": {
                name: "Electric Bill",
                type: ReconciliationExpenseType.StatementBalance,
                typicalAmount: 120,
              },
            }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useReconciliationExpenses("uid-1"));

      await waitFor(() => {
        expect(result.current.reconciliationExpenses).toHaveLength(1);
      });

      expect(result.current.reconciliationExpenses[0]).toMatchObject({
        id: "expense-1",
        name: "Electric Bill",
        type: ReconciliationExpenseType.StatementBalance,
        typicalAmount: 120,
      });
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);
      const { unmount } = renderHook(() => useReconciliationExpenses("uid-1"));
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

      const { result } = renderHook(() => useReconciliationExpenses("uid-1"));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error!.message).toBe("permission denied");
    });
  });
});
