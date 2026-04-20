"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LedgerList } from "@/components/ledgers";
import { useLedgers } from "@/hooks/use-ledgers";
import { updateLedger } from "@/services/ledgers";
import type { UpdateLedgerInput } from "@/lib/types";

// TODO: replace with real uid from auth context once auth is implemented
const PLACEHOLDER_UID = "";

export default function LedgersPage() {
  const queryClient = useQueryClient();
  const { ledgers, isLoading } = useLedgers(PLACEHOLDER_UID);

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLedgerInput }) =>
      updateLedger(PLACEHOLDER_UID, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["ledgers", PLACEHOLDER_UID],
      });
    },
  });

  const handleNewLedger = () => {
    // TODO: open new ledger dialog/modal
  };

  const handleEditLedger = (id: string, data: UpdateLedgerInput) => {
    editMutation.mutate({ id, data });
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <LedgerList
        ledgers={ledgers}
        isLoading={isLoading}
        onNewLedger={handleNewLedger}
        onEditLedger={handleEditLedger}
      />
    </div>
  );
}
