"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LedgerList, CreateLedgerDialog } from "@/components/ledgers";
import { useLedgers } from "@/hooks/use-ledgers";
import { useDeleteLedger } from "@/hooks/use-delete-ledger";
import { useAuth } from "@/hooks/use-auth";
import { createLedger, updateLedger } from "@/services/ledgers";
import type { CreateLedgerInput, UpdateLedgerInput } from "@/lib/types";

export default function LedgersPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { ledgers, isLoading } = useLedgers(uid);
  const queryClient = useQueryClient();
  const { mutate: deleteLedger } = useDeleteLedger(uid);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLedgerInput }) =>
      updateLedger(uid, id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ledgers", uid] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateLedgerInput) => createLedger(uid, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ledgers", uid] });
    },
  });

  const handleNewLedger = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateLedger = async (data: CreateLedgerInput): Promise<void> => {
    await createMutation.mutateAsync(data);
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
      <CreateLedgerDialog
        open={createDialogOpen}
        onSubmit={handleCreateLedger}
        onClose={() => {
          setCreateDialogOpen(false);
        }}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
