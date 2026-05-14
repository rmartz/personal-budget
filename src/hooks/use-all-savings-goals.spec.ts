import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, cleanup, act } from "@testing-library/react";
import { useAllSavingsGoals } from "./use-all-savings-goals";

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

describe("useAllSavingsGoals", () => {
  describe("empty uid guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useAllSavingsGoals(""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns an empty array when uid is empty", () => {
      const { result } = renderHook(() => useAllSavingsGoals(""));
      expect(result.current.goals).toEqual([]);
    });

    it("sets isLoading to false when uid is empty", () => {
      const { result } = renderHook(() => useAllSavingsGoals(""));
      expect(result.current.isLoading).toBe(false);
    });

    it("resets isLoading to true when uid changes from empty to non-empty", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);

      const { result, rerender } = renderHook(
        ({ uid }: { uid: string }) => useAllSavingsGoals(uid),
        { initialProps: { uid: "" } },
      );

      expect(result.current.isLoading).toBe(false);

      act(() => {
        rerender({ uid: "uid-1" });
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("clears error when uid changes from empty to non-empty", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, _cb: unknown, errCb: (err: Error) => void) => {
          errCb(new Error("permission denied"));
          return mockUnsubscribe;
        },
      );

      const { result, rerender } = renderHook(
        ({ uid }: { uid: string }) => useAllSavingsGoals(uid),
        { initialProps: { uid: "uid-1" } },
      );

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      mockOnValue.mockReturnValue(mockUnsubscribe);

      act(() => {
        rerender({ uid: "uid-2" });
      });

      expect(result.current.error).toBeUndefined();
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

      const { result } = renderHook(() => useAllSavingsGoals("uid-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.goals).toEqual([]);
    });

    it("flattens goals across multiple ledger IDs", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({
              "ledger-1": { "goal-1": makeFirebaseGoal() },
              "ledger-2": { "goal-2": { ...makeFirebaseGoal(), name: "Vacation" } },
            }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useAllSavingsGoals("uid-1"));

      await waitFor(() => {
        expect(result.current.goals).toHaveLength(2);
      });

      const ids = result.current.goals.map((g) => g.id);
      expect(ids).toContain("goal-1");
      expect(ids).toContain("goal-2");

      const ledgerIds = result.current.goals.map((g) => g.ledgerId);
      expect(ledgerIds).toContain("ledger-1");
      expect(ledgerIds).toContain("ledger-2");
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() => useAllSavingsGoals("uid-1"));
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

      const { result } = renderHook(() => useAllSavingsGoals("uid-1"));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error!.message).toBe("permission denied");
    });

    it("sets isLoading to false after the error callback fires", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, _cb: unknown, errCb: (err: Error) => void) => {
          errCb(new Error("permission denied"));
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useAllSavingsGoals("uid-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
