import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAnnuityPayments } from "./use-annuity-payments";

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

describe("useAnnuityPayments — empty guard", () => {
  it("does not subscribe when uid is empty", () => {
    renderHook(() => useAnnuityPayments("", "ann-1"));
    expect(mockOnValue).not.toHaveBeenCalled();
  });

  it("does not subscribe when annuityId is empty", () => {
    renderHook(() => useAnnuityPayments("uid-1", ""));
    expect(mockOnValue).not.toHaveBeenCalled();
  });

  it("returns an empty array when uid is empty", () => {
    const { result } = renderHook(() => useAnnuityPayments("", "ann-1"));
    expect(result.current.payments).toEqual([]);
  });

  it("returns an empty array when annuityId is empty", () => {
    const { result } = renderHook(() => useAnnuityPayments("uid-1", ""));
    expect(result.current.payments).toEqual([]);
  });
});

describe("useAnnuityPayments — subscription", () => {
  it("returns empty array when snapshot has no data", async () => {
    mockOnValue.mockImplementation(
      (_ref: unknown, callback: (snap: unknown) => void) => {
        callback({ exists: () => false });
        return mockUnsubscribe;
      },
    );

    const { result } = renderHook(() => useAnnuityPayments("uid-1", "ann-1"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.payments).toEqual([]);
  });

  it("maps snapshot data to AnnuityPayment objects", async () => {
    mockOnValue.mockImplementation(
      (_ref: unknown, callback: (snap: unknown) => void) => {
        callback({
          exists: () => true,
          val: () => ({
            "pay-1": {
              amount: 250,
              date: "2024-03-01T00:00:00.000Z",
            },
          }),
        });
        return mockUnsubscribe;
      },
    );

    const { result } = renderHook(() => useAnnuityPayments("uid-1", "ann-1"));

    await waitFor(() => {
      expect(result.current.payments).toHaveLength(1);
    });

    expect(result.current.payments[0]).toMatchObject({
      id: "pay-1",
      annuityId: "ann-1",
      amount: 250,
    });
    expect(result.current.payments[0]!.date).toBeInstanceOf(Date);
  });

  it("unsubscribes on unmount", () => {
    mockOnValue.mockReturnValue(mockUnsubscribe);
    const { unmount } = renderHook(() => useAnnuityPayments("uid-1", "ann-1"));
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

    const { result } = renderHook(() => useAnnuityPayments("uid-1", "ann-1"));

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.error!.message).toBe("permission denied");
  });
});
