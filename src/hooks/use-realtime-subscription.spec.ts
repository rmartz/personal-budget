import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useRealtimeSubscription } from "./use-realtime-subscription";

interface MockSnapshot {
  val: () => unknown;
}

type ValueCallback = (snapshot: MockSnapshot) => void;
type ErrorCallback = (error: Error) => void;

const mockUnsubscribe = vi.fn();
const mockOnValue = vi.fn();

vi.mock("firebase/database", () => ({
  getDatabase: vi.fn(() => ({ type: "mock-db" })),
  ref: vi.fn((_db: unknown, path: string) => ({ path })),
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

function snapshotOf(value: string): MockSnapshot {
  return { val: () => value };
}

function parseString(snapshot: MockSnapshot): string {
  return String(snapshot.val());
}

describe("useRealtimeSubscription", () => {
  it("does not subscribe when path is undefined", () => {
    renderHook(() => useRealtimeSubscription(undefined, parseString));
    expect(mockOnValue).not.toHaveBeenCalled();
  });

  it("is not loading when path is undefined", () => {
    const { result } = renderHook(() =>
      useRealtimeSubscription(undefined, parseString),
    );
    expect(result.current.isLoading).toBe(false);
  });

  it("returns the parsed snapshot for the subscribed path", () => {
    mockOnValue.mockImplementation((_ref: unknown, onValue: ValueCallback) => {
      onValue(snapshotOf("first"));
      return mockUnsubscribe;
    });

    const { result } = renderHook(() =>
      useRealtimeSubscription("users/a", parseString),
    );

    expect(result.current.data).toBe("first");
  });

  it("reports loading and drops the previous data when the path changes", () => {
    let emit: ValueCallback | undefined;
    mockOnValue.mockImplementation((_ref: unknown, onValue: ValueCallback) => {
      emit = onValue;
      return mockUnsubscribe;
    });

    const { result, rerender } = renderHook(
      ({ path }) => useRealtimeSubscription(path, parseString),
      { initialProps: { path: "users/a" } },
    );
    act(() => {
      emit?.(snapshotOf("from-a"));
    });

    rerender({ path: "users/b" });

    expect(result.current).toEqual({
      data: undefined,
      isLoading: true,
      error: undefined,
    });
  });

  it("keeps the current path's data when the error callback fires", () => {
    let emit: ValueCallback | undefined;
    let fail: ErrorCallback | undefined;
    mockOnValue.mockImplementation(
      (_ref: unknown, onValue: ValueCallback, onError: ErrorCallback) => {
        emit = onValue;
        fail = onError;
        return mockUnsubscribe;
      },
    );

    const { result } = renderHook(() =>
      useRealtimeSubscription("users/a", parseString),
    );
    act(() => {
      emit?.(snapshotOf("kept"));
      fail?.(new Error("permission denied"));
    });

    expect(result.current.data).toBe("kept");
  });

  it("unsubscribes when the path changes", () => {
    mockOnValue.mockReturnValue(mockUnsubscribe);

    const { rerender } = renderHook(
      ({ path }) => useRealtimeSubscription(path, parseString),
      { initialProps: { path: "users/a" } },
    );
    rerender({ path: "users/b" });

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
