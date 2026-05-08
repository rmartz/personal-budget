import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { useReconciliationAccounts } from "./use-reconciliation-accounts";
import { ReconciliationAccountTier } from "@/lib/firebase/schema/reconciliation-accounts";

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

describe("useReconciliationAccounts", () => {
  describe("empty guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useReconciliationAccounts(""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns an empty array when uid is empty", () => {
      const { result } = renderHook(() => useReconciliationAccounts(""));
      expect(result.current.reconciliationAccounts).toEqual([]);
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

      const { result } = renderHook(() => useReconciliationAccounts("uid-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.reconciliationAccounts).toEqual([]);
    });

    it("maps snapshot data to ReconciliationAccount objects", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({
              "account-1": {
                name: "Chase Checking",
                tier: ReconciliationAccountTier.ShortTerm,
                targetFloat: 2000,
              },
            }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useReconciliationAccounts("uid-1"));

      await waitFor(() => {
        expect(result.current.reconciliationAccounts).toHaveLength(1);
      });

      expect(result.current.reconciliationAccounts[0]).toMatchObject({
        id: "account-1",
        name: "Chase Checking",
        tier: ReconciliationAccountTier.ShortTerm,
        targetFloat: 2000,
      });
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);
      const { unmount } = renderHook(() => useReconciliationAccounts("uid-1"));
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

      const { result } = renderHook(() => useReconciliationAccounts("uid-1"));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error!.message).toBe("permission denied");
    });
  });
});
