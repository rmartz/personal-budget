"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LedgerList } from "@/components/ledgers";
import { useLedgers } from "@/hooks/use-ledgers";
import { useDeleteLedger } from "@/hooks/use-delete-ledger";
import { useAuth } from "@/hooks/use-auth";
import { updateLedger } from "@/services/ledgers";
import type { UpdateLedgerInput } from "@/lib/types";

export default function LedgersPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { ledgers, isLoading } = useLedgers(uid);
  const queryClient = useQueryClient();
  const { mutate: deleteLedger } = useDeleteLedger(uid);

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLedgerInput }) =>
      updateLedger(uid, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ledgers", uid] });
    },
  });

  const handleNewLedger = () => {
    // TODO: open new ledger dialog/modal
  };

  const handleEditLedger = (
    id: string,
    data: UpdateLedgerInput,
  ): Promise<void> => editMutation.mutateAsync({ id, data });

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <LedgerList
        ledgers={ledgers}
        isLoading={isLoading}
        onNewLedger={handleNewLedger}
        onEditLedger={handleEditLedger}
        onDeleteLedger={deleteLedger}
      />
    </div>
  );
}
