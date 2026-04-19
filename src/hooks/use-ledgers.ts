"use client";

import { useQuery } from "@tanstack/react-query";
import type { Ledger } from "@/lib/types";
import { getLedgers } from "@/services/ledgers";

export function useLedgers(uid: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ledgers", uid],
    queryFn: () => getLedgers(uid),
    enabled: uid.length > 0,
  });

  const ledgers: Ledger[] = data ?? [];

  return { ledgers, isLoading, error };
}
