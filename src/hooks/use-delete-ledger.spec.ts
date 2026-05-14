import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import * as ledgersService from "@/services/ledgers";

import { useDeleteLedger } from "./use-delete-ledger";

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

describe("useDeleteLedger", () => {
  it("calls deleteLedger with the uid and ledger id", async () => {
    const spy = vi
      .spyOn(ledgersService, "deleteLedger")
      .mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteLedger("uid-123"), {
      wrapper: makeWrapper(),
    });

    result.current.mutate("ledger-abc");

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith("uid-123", "ledger-abc");
    });
  });

  it("reports success after the mutation resolves", async () => {
    vi.spyOn(ledgersService, "deleteLedger").mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteLedger("uid-123"), {
      wrapper: makeWrapper(),
    });

    result.current.mutate("ledger-abc");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("rejects with an error when uid is empty", async () => {
    const spy = vi.spyOn(ledgersService, "deleteLedger");

    const { result } = renderHook(() => useDeleteLedger(""), {
      wrapper: makeWrapper(),
    });

    result.current.mutate("ledger-abc");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(spy).not.toHaveBeenCalled();
  });
});
