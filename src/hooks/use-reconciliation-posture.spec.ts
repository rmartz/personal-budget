import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Posture } from "@/lib/firebase/schema/investments";

import { useReconciliationPosture } from "./use-reconciliation-posture";

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

describe("useReconciliationPosture", () => {
  describe("empty guard", () => {
    it("does not subscribe when uid is empty", () => {
      renderHook(() => useReconciliationPosture(""));
      expect(mockOnValue).not.toHaveBeenCalled();
    });

    it("returns Posture.Balanced when uid is empty", () => {
      const { result } = renderHook(() => useReconciliationPosture(""));
      expect(result.current.posture).toBe(Posture.Balanced);
    });

    it("returns isLoading false when uid is empty", () => {
      const { result } = renderHook(() => useReconciliationPosture(""));
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("subscription", () => {
    it("returns Posture.Balanced when snapshot has no data", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({ val: () => null });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useReconciliationPosture("uid-1"));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.posture).toBe(Posture.Balanced);
    });

    it("returns the stored posture from Firebase", async () => {
      mockOnValue.mockImplementation(
        (_ref: unknown, callback: (snap: unknown) => void) => {
          callback({ val: () => Posture.Conservative });
          return mockUnsubscribe;
        },
      );

      const { result } = renderHook(() => useReconciliationPosture("uid-1"));

      await waitFor(() => {
        expect(result.current.posture).toBe(Posture.Conservative);
      });
    });

    it("unsubscribes on unmount", () => {
      mockOnValue.mockReturnValue(mockUnsubscribe);
      const { unmount } = renderHook(() => useReconciliationPosture("uid-1"));
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

      const { result } = renderHook(() => useReconciliationPosture("uid-1"));

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error!.message).toBe("permission denied");
    });
  });
});
