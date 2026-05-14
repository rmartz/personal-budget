import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSavingsGoals } from "./use-savings-goals";

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

function makeFirebaseGoal() {
  return {
    name: "Emergency Fund",
    targetAmount: 5000,
    fundedAmount: 1000,
    priority: 1,
  };
}

describe("useSavingsGoals", () => {
  describe("empty guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useSavingsGoals("", "ledger-1"));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("does not subscribe when ledgerId is empty", () => {
      renderHook(() => useSavingsGoals("uid-1", ""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns an empty array when uid is empty", () => {
      const { result } = renderHook(() => useSavingsGoals("", "ledger-1"));
      expect(result.current.savingsGoals).toEqual([]);
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

      const { result } = renderHook(() => useSavingsGoals("uid-1", "ledger-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.savingsGoals).toEqual([]);
    });

    it("maps snapshot data to BudgetLedgerSavingsGoal objects", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({ "goal-1": makeFirebaseGoal() }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useSavingsGoals("uid-1", "ledger-1"));

      await waitFor(() => {
        expect(result.current.savingsGoals).toHaveLength(1);
      });

      expect(result.current.savingsGoals[0]).toMatchObject({
        id: "goal-1",
        ledgerId: "ledger-1",
        name: "Emergency Fund",
        targetAmount: 5000,
        fundedAmount: 1000,
        priority: 1,
      });
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() =>
        useSavingsGoals("uid-1", "ledger-1"),
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

      const { result } = renderHook(() => useSavingsGoals("uid-1", "ledger-1"));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error!.message).toBe("permission denied");
    });
  });

  describe("re-subscription", () => {
    it("resubscribes when uid changes", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);

      const { rerender } = renderHook(
        ({ uid }: { uid: string }) => useSavingsGoals(uid, "ledger-1"),
        { initialProps: { uid: "uid-1" } },
      );

      act(() => {
        rerender({ uid: "uid-2" });
      });

      expect(mockOnValue).toHaveBeenCalledTimes(2);
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
