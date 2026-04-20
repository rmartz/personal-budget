import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useDeleteLedger } from "./use-delete-ledger";
import * as ledgersService from "@/services/ledgers";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
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
});
