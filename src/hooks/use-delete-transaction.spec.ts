import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import type { ReactNode } from "react";
import { useDeleteTransaction } from "./use-delete-transaction";
import * as transactionsService from "@/services/transactions";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useDeleteTransaction", () => {
  it("calls deleteTransaction with the uid, ledgerId, and transaction id", async () => {
    const spy = vi
      .spyOn(transactionsService, "deleteTransaction")
      .mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteTransaction("uid-123", "ledger-abc"),
      { wrapper: makeWrapper() },
    );

    result.current.mutate("tx-xyz");

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith("uid-123", "ledger-abc", "tx-xyz");
    });
  });

  it("reports success after the mutation resolves", async () => {
    vi.spyOn(transactionsService, "deleteTransaction").mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(
      () => useDeleteTransaction("uid-123", "ledger-abc"),
      { wrapper: makeWrapper() },
    );

    result.current.mutate("tx-xyz");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("rejects with an error when uid is empty", async () => {
    const spy = vi.spyOn(transactionsService, "deleteTransaction");

    const { result } = renderHook(
      () => useDeleteTransaction("", "ledger-abc"),
      { wrapper: makeWrapper() },
    );

    result.current.mutate("tx-xyz");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("rejects with an error when ledgerId is empty", async () => {
    const spy = vi.spyOn(transactionsService, "deleteTransaction");

    const { result } = renderHook(() => useDeleteTransaction("uid-123", ""), {
      wrapper: makeWrapper(),
    });

    result.current.mutate("tx-xyz");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(spy).not.toHaveBeenCalled();
  });
});
