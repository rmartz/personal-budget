"use client";

import { useQuery } from "@tanstack/react-query";
import type { InvestmentLedger } from "@/lib/types";
import { getInvestmentLedgers } from "@/services/investment-ledgers";

interface UseInvestmentLedgersResult {
  ledgers: InvestmentLedger[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useInvestmentLedgers(uid: string): UseInvestmentLedgersResult {
  const {
    data: ledgers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["investmentLedgers", uid],
    queryFn: () => getInvestmentLedgers(uid),
    enabled: !!uid,
  });

  return {
    ledgers,
    isLoading,
    error: error instanceof Error ? error : null,
  };
}
