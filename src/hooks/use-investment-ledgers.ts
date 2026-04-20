"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateInvestmentLedgerInput,
  InvestmentLedger,
  UpdateInvestmentLedgerInput,
} from "@/lib/types";
import {
  createInvestmentLedger,
  deleteInvestmentLedger,
  getInvestmentLedgers,
  updateInvestmentLedger,
} from "@/services/investment-ledgers";

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

export function useCreateInvestmentLedger(uid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvestmentLedgerInput) => {
      if (!uid) return Promise.reject(new Error("uid required"));
      return createInvestmentLedger(uid, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["investmentLedgers", uid],
      });
    },
  });
}

export function useUpdateInvestmentLedger(uid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateInvestmentLedgerInput;
    }) => {
      if (!uid) return Promise.reject(new Error("uid required"));
      return updateInvestmentLedger(uid, id, data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["investmentLedgers", uid],
      });
    },
  });
}

export function useDeleteInvestmentLedger(uid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!uid) return Promise.reject(new Error("uid required"));
      return deleteInvestmentLedger(uid, id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["investmentLedgers", uid],
      });
    },
  });
}
