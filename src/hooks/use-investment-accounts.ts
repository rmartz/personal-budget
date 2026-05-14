"use client";

// TODO: Implement real Firebase subscription in epic #8 (Investment Ledger Management)
import type { InvestmentAccount } from "@/lib/firebase/schema/investments";

export function useInvestmentAccounts(_uid: string): {
  accounts: InvestmentAccount[];
  isLoading: boolean;
} {
  return { accounts: [], isLoading: false };
}
