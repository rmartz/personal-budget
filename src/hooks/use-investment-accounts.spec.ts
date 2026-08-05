import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useInvestmentAccounts } from "./use-investment-accounts";

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

describe("useInvestmentAccounts", () => {
  describe("empty guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useInvestmentAccounts(""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns an empty array when uid is empty", () => {
      const { result } = renderHook(() => useInvestmentAccounts(""));
      expect(result.current.accounts).toEqual([]);
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

      const { result } = renderHook(() => useInvestmentAccounts("uid-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.accounts).toEqual([]);
    });

    it("maps snapshot data to InvestmentAccount objects keyed by id", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({
            exists: () => true,
            val: () => ({
              "acct-1": {
                name: "Vanguard Brokerage",
                currentPercent: 42,
                targetPercent: 60,
              },
            }),
          });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useInvestmentAccounts("uid-1"));

      await waitFor(() => {
        expect(result.current.accounts).toHaveLength(1);
      });

      expect(result.current.accounts[0]).toEqual({
        id: "acct-1",
        name: "Vanguard Brokerage",
        currentPercent: 42,
        targetPercent: 60,
      });
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);
      const { unmount } = renderHook(() => useInvestmentAccounts("uid-1"));
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

      const { result } = renderHook(() => useInvestmentAccounts("uid-1"));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error!.message).toBe("permission denied");
    });
  });
});
