import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useDeleteInvestmentAccount } from "./use-delete-investment-account";

const mockDeleteInvestmentAccount = vi.fn();

vi.mock("@/services/investment-accounts", () => ({
  deleteInvestmentAccount: (...args: unknown[]): Promise<void> =>
    mockDeleteInvestmentAccount(...args) as Promise<void>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useDeleteInvestmentAccount", () => {
  it("calls deleteInvestmentAccount with the id", async () => {
    mockDeleteInvestmentAccount.mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteInvestmentAccount("uid-1"));

    await act(async () => {
      await result.current.deleteOne("acct-1");
    });

    expect(mockDeleteInvestmentAccount).toHaveBeenCalledWith("uid-1", "acct-1");
  });

  it("sets isDeleting true during deletion and false after", async () => {
    let resolve!: () => void;
    mockDeleteInvestmentAccount.mockReturnValue(
      new Promise<void>((r) => {
        resolve = r;
      }),
    );

    const { result } = renderHook(() => useDeleteInvestmentAccount("uid-1"));

    let deletePromise!: Promise<void>;
    act(() => {
      deletePromise = result.current.deleteOne("acct-1");
    });

    expect(result.current.isDeleting).toBe(true);

    await act(async () => {
      resolve();
      await deletePromise;
    });

    expect(result.current.isDeleting).toBe(false);
  });

  it("throws and resets isDeleting when uid is empty", async () => {
    const { result } = renderHook(() => useDeleteInvestmentAccount(""));

    await expect(
      act(async () => {
        await result.current.deleteOne("acct-1");
      }),
    ).rejects.toThrow(
      "Cannot delete investment account: user is not authenticated",
    );

    expect(result.current.isDeleting).toBe(false);
  });
});
