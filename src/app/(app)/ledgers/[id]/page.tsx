"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useLedgersSubscription } from "@/hooks/use-ledgers-subscription";
import { useCreateTransaction } from "@/hooks/use-create-transaction";
import {
  LedgerTransactionListView,
  AddExpenseDialog,
} from "@/components/ledger-transactions";

export default function LedgerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";

  const { ledgers, isLoading: ledgersLoading } = useLedgersSubscription(uid);
  const { transactions, isLoading: txLoading } = useTransactions(uid, id);
  const { addExpense, isSubmitting } = useCreateTransaction(uid, id);

  const [dialogOpen, setDialogOpen] = useState(false);

  const ledger = ledgers.find((l) => l.id === id);
  const isLoading = authLoading || ledgersLoading || txLoading;
  const ledgerName = ledger?.name ?? "";

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <LedgerTransactionListView
        ledgerName={ledgerName}
        transactions={transactions}
        isLoading={isLoading}
        onAddExpense={() => {
          setDialogOpen(true);
        }}
      />
      <AddExpenseDialog
        open={dialogOpen}
        onSubmit={addExpense}
        onClose={() => {
          setDialogOpen(false);
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
