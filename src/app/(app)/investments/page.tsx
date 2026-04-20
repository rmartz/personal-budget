"use client";

import { useState } from "react";
import {
  useCreateInvestmentLedger,
  useDeleteInvestmentLedger,
  useInvestmentLedgers,
  useUpdateInvestmentLedger,
} from "@/hooks/use-investment-ledgers";
import { InvestmentLedgerList } from "@/components/investments";
import { InvestmentLedgerFormDialog } from "@/components/investments/InvestmentLedgerFormDialog";
import { InvestmentLedgerDeleteDialog } from "@/components/investments/InvestmentLedgerDeleteDialog";
import type { InvestmentLedger } from "@/lib/types";

export default function InvestmentsPage() {
  // TODO: replace with authenticated user id from auth context
  const uid = "";
  const { ledgers, isLoading } = useInvestmentLedgers(uid);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingLedger, setEditingLedger] = useState<
    InvestmentLedger | undefined
  >(undefined);
  const [deletingLedger, setDeletingLedger] = useState<
    InvestmentLedger | undefined
  >(undefined);

  const createMutation = useCreateInvestmentLedger(uid);
  const updateMutation = useUpdateInvestmentLedger(uid);
  const deleteMutation = useDeleteInvestmentLedger(uid);

  const handleNewLedger = () => {
    setEditingLedger(undefined);
    setFormDialogOpen(true);
  };

  const handleEditLedger = (ledger: InvestmentLedger) => {
    setEditingLedger(ledger);
    setFormDialogOpen(true);
  };

  const handleDeleteLedger = (ledger: InvestmentLedger) => {
    setDeletingLedger(ledger);
  };

  const handleFormSubmit = (data: { name: string }) => {
    if (editingLedger) {
      updateMutation.mutate(
        { id: editingLedger.id, data },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
          },
        },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormDialogOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingLedger) return;
    deleteMutation.mutate(deletingLedger.id, {
      onSuccess: () => {
        setDeletingLedger(undefined);
      },
    });
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <InvestmentLedgerList
        ledgers={ledgers ?? []}
        isLoading={isLoading}
        onNewLedger={handleNewLedger}
        onEditLedger={handleEditLedger}
        onDeleteLedger={handleDeleteLedger}
      />
      <InvestmentLedgerFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        ledger={editingLedger}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
      {deletingLedger && (
        <InvestmentLedgerDeleteDialog
          open={!!deletingLedger}
          onOpenChange={(open) => {
            if (!open) setDeletingLedger(undefined);
          }}
          ledger={deletingLedger}
          onConfirm={handleDeleteConfirm}
          isPending={deleteMutation.isPending}
        />
      )}
    </main>
  );
}
