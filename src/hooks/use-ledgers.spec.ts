import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useLedgers } from "./use-ledgers";
import * as ledgersService from "@/services/ledgers";
import type { Ledger } from "@/lib/types";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function makeLedger(overrides: Partial<Ledger> = {}): Ledger {
  return {
    id: "test-id",
    name: "Test Ledger",
    cashCap: undefined,
    cashBalance: 100,
    investmentBalance: 50,
    ...overrides,
  };
}

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useLedgers", () => {
  describe("enabled guard", () => {
    it("does not fetch when uid is empty", () => {
      const spy = vi.spyOn(ledgersService, "getLedgers");
      renderHook(() => useLedgers(""), { wrapper: makeWrapper() });
      expect(spy).not.toHaveBeenCalled();
    });

    it("fetches when uid is non-empty", async () => {
      const spy = vi.spyOn(ledgersService, "getLedgers").mockResolvedValue([]);
      renderHook(() => useLedgers("uid-123"), { wrapper: makeWrapper() });
      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith("uid-123");
      });
    });
  });

  describe("data default", () => {
    it("returns an empty array when data is undefined (query disabled)", () => {
      const { result } = renderHook(() => useLedgers(""), {
        wrapper: makeWrapper(),
      });
      expect(result.current.ledgers).toEqual([]);
    });

    it("returns ledgers from the service when the query resolves", async () => {
      const ledger = makeLedger({ id: "abc", name: "My Ledger" });
      vi.spyOn(ledgersService, "getLedgers").mockResolvedValue([ledger]);
      const { result } = renderHook(() => useLedgers("uid-456"), {
        wrapper: makeWrapper(),
      });
      await waitFor(() => {
        expect(result.current.ledgers).toEqual([ledger]);
      });
    });
  });
});
