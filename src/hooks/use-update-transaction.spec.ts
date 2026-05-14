import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as transactionsService from "@/services/transactions";

import { useUpdateTransaction } from "./use-update-transaction";

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

const sampleData = {
  date: new Date("2024-03-15T00:00:00.000Z"),
  amount: 250,
  description: "Updated coffee",
};

describe("useUpdateTransaction", () => {
  it("calls updateTransaction with the uid, ledgerId, id, and data", async () => {
    const spy = vi
      .spyOn(transactionsService, "updateTransaction")
      .mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useUpdateTransaction("uid-123", "ledger-abc"),
      { wrapper: makeWrapper() },
    );

    result.current.mutate({ id: "tx-xyz", data: sampleData });

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(
        "uid-123",
        "ledger-abc",
        "tx-xyz",
        sampleData,
      );
    });
  });

  it("reports success after the mutation resolves", async () => {
    vi.spyOn(transactionsService, "updateTransaction").mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(
      () => useUpdateTransaction("uid-123", "ledger-abc"),
      { wrapper: makeWrapper() },
    );

    result.current.mutate({ id: "tx-xyz", data: sampleData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("rejects with an error when uid is empty", async () => {
    const spy = vi.spyOn(transactionsService, "updateTransaction");

    const { result } = renderHook(
      () => useUpdateTransaction("", "ledger-abc"),
      { wrapper: makeWrapper() },
    );

    result.current.mutate({ id: "tx-xyz", data: sampleData });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("rejects with an error when ledgerId is empty", async () => {
    const spy = vi.spyOn(transactionsService, "updateTransaction");

    const { result } = renderHook(() => useUpdateTransaction("uid-123", ""), {
      wrapper: makeWrapper(),
    });

    result.current.mutate({ id: "tx-xyz", data: sampleData });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(spy).not.toHaveBeenCalled();
  });
});
