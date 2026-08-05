import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useUpdateInvestmentAccount } from "./use-update-investment-account";

const mockUpdateInvestmentAccount = vi.fn();

vi.mock("@/services/investment-accounts", () => ({
  updateInvestmentAccount: (...args: unknown[]): Promise<void> =>
    mockUpdateInvestmentAccount(...args) as Promise<void>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useUpdateInvestmentAccount", () => {
  it("calls updateInvestmentAccount with the id and data", async () => {
    mockUpdateInvestmentAccount.mockResolvedValue(undefined);
    const { result } = renderHook(() => useUpdateInvestmentAccount("uid-1"));

    await act(async () => {
      await result.current.updateOne("acct-1", { targetPercent: 55 });
    });

    expect(mockUpdateInvestmentAccount).toHaveBeenCalledWith(
      "uid-1",
      "acct-1",
      {
        targetPercent: 55,
      },
    );
  });

  it("sets isSubmitting true during submission and false after", async () => {
    let resolve!: () => void;
    mockUpdateInvestmentAccount.mockReturnValue(
      new Promise<void>((r) => {
        resolve = r;
      }),
    );

    const { result } = renderHook(() => useUpdateInvestmentAccount("uid-1"));

    let updatePromise!: Promise<void>;
    act(() => {
      updatePromise = result.current.updateOne("acct-1", { targetPercent: 55 });
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolve();
      await updatePromise;
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it("throws and resets isSubmitting when uid is empty", async () => {
    const { result } = renderHook(() => useUpdateInvestmentAccount(""));

    await expect(
      act(async () => {
        await result.current.updateOne("acct-1", { targetPercent: 55 });
      }),
    ).rejects.toThrow(
      "Cannot update investment account: user is not authenticated",
    );

    expect(result.current.isSubmitting).toBe(false);
  });
});
