import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useCreateInvestmentAccount } from "./use-create-investment-account";

const mockCreateInvestmentAccount = vi.fn();

vi.mock("@/services/investment-accounts", () => ({
  createInvestmentAccount: (...args: unknown[]): Promise<unknown> =>
    mockCreateInvestmentAccount(...args) as Promise<unknown>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useCreateInvestmentAccount", () => {
  it("calls createInvestmentAccount with the uid and data", async () => {
    mockCreateInvestmentAccount.mockResolvedValue({
      id: "acct-new",
      name: "Roth IRA",
      currentPercent: 10,
      targetPercent: 25,
    });
    const { result } = renderHook(() => useCreateInvestmentAccount("uid-1"));

    await act(async () => {
      await result.current.createOne({
        name: "Roth IRA",
        currentPercent: 10,
        targetPercent: 25,
      });
    });

    expect(mockCreateInvestmentAccount).toHaveBeenCalledWith("uid-1", {
      name: "Roth IRA",
      currentPercent: 10,
      targetPercent: 25,
    });
  });

  it("sets isSubmitting true during submission and false after", async () => {
    let resolve!: () => void;
    mockCreateInvestmentAccount.mockReturnValue(
      new Promise<void>((r) => {
        resolve = r;
      }),
    );

    const { result } = renderHook(() => useCreateInvestmentAccount("uid-1"));

    let createPromise!: Promise<unknown>;
    act(() => {
      createPromise = result.current.createOne({
        name: "Roth IRA",
        currentPercent: 10,
        targetPercent: 25,
      });
    });

    expect(result.current.isSubmitting).toBe(true);

    await act(async () => {
      resolve();
      await createPromise;
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it("throws when uid is empty", async () => {
    const { result } = renderHook(() => useCreateInvestmentAccount(""));

    await expect(
      act(async () => {
        await result.current.createOne({
          name: "Roth IRA",
          currentPercent: 10,
          targetPercent: 25,
        });
      }),
    ).rejects.toThrow(
      "Cannot create investment account: user is not authenticated",
    );

    expect(mockCreateInvestmentAccount).not.toHaveBeenCalled();
  });
});
