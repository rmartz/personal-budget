import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSavingsGoal } from "./use-savings-goal";

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

describe("useSavingsGoal", () => {
  describe("empty-uid guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useSavingsGoal("", "goal-1"));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns undefined goal when uid is empty", () => {
      const { result } = renderHook(() => useSavingsGoal("", "goal-1"));
      expect(result.current.goal).toBeUndefined();
    });

    it("sets isLoading to false when uid is empty", () => {
      const { result } = renderHook(() => useSavingsGoal("", "goal-1"));
      expect(result.current.isLoading).toBe(false);
    });

    it("does not subscribe when goalId is empty", () => {
      renderHook(() => useSavingsGoal("uid-1", ""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("resets isLoading to true when uid changes from empty to non-empty", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);

      const { result, rerender } = renderHook(
        ({ uid }: { uid: string }) => useSavingsGoal(uid, "goal-1"),
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
        ({ uid }: { uid: string }) => useSavingsGoal(uid, "goal-1"),
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
    it("returns the matching goal when found in snapshot", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({
              "ledger-1": { "goal-1": makeFirebaseGoal() },
            }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useSavingsGoal("uid-1", "goal-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.goal).toBeDefined();
      expect(result.current.goal!.id).toBe("goal-1");
      expect(result.current.goal!.ledgerId).toBe("ledger-1");
      expect(result.current.goal!.name).toBe("Emergency Fund");
    });

    it("returns undefined goal when goalId is not found in snapshot", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({
              "ledger-1": { "other-goal": makeFirebaseGoal() },
            }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useSavingsGoal("uid-1", "goal-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.goal).toBeUndefined();
    });

    it("returns undefined goal when snapshot has no data", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({ exists: () => false });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useSavingsGoal("uid-1", "goal-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.goal).toBeUndefined();
    });

    it("sets error when onValue calls the error callback", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, _cb: unknown, errCb: (err: Error) => void) => {
          errCb(new Error("permission denied"));
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useSavingsGoal("uid-1", "goal-1"));

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

      const { result } = renderHook(() => useSavingsGoal("uid-1", "goal-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() => useSavingsGoal("uid-1", "goal-1"));
      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
