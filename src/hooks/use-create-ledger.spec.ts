import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import type { ReactNode } from "react";
import { useCreateLedger } from "./use-create-ledger";
import * as ledgersService from "@/services/ledgers";
import type { Ledger } from "@/lib/types";

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

function makeLedger(overrides: Partial<Ledger> = {}): Ledger {
  return {
    id: "new-id",
    name: "Test Ledger",
    cashCap: undefined,
    cashBalance: 0,
    investmentBalance: 0,
    ...overrides,
  };
}

describe("useCreateLedger", () => {
  it("calls createLedger with the uid and input data", async () => {
    const ledger = makeLedger({ id: "abc", name: "Groceries" });
    const spy = vi
      .spyOn(ledgersService, "createLedger")
      .mockResolvedValue(ledger);

    const { result } = renderHook(() => useCreateLedger("uid-123"), {
      wrapper: makeWrapper(),
    });

    result.current.mutate({ name: "Groceries", cashCap: 300 });

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith("uid-123", {
        name: "Groceries",
        cashCap: 300,
      });
    });
  });

  it("rejects with an error when uid is empty", async () => {
    const spy = vi.spyOn(ledgersService, "createLedger");

    const { result } = renderHook(() => useCreateLedger(""), {
      wrapper: makeWrapper(),
    });

    result.current.mutate({ name: "Groceries" });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(spy).not.toHaveBeenCalled();
    expect(result.current.error!.message).toBe(
      "Cannot create ledger: user is not authenticated",
    );
  });
});
