"use client";

import { useState } from "react";
import { LedgerList, NewLedgerDialog } from "@/components/ledgers";
import { useLedgers } from "@/hooks/use-ledgers";
import { useDeleteLedger } from "@/hooks/use-delete-ledger";
import { useCreateLedger } from "@/hooks/use-create-ledger";
import { useAuth } from "@/hooks/use-auth";

export default function LedgersPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { ledgers, isLoading } = useLedgers(uid);
  const { mutate: deleteLedger } = useDeleteLedger(uid);
  const { mutateAsync: createLedger } = useCreateLedger(uid);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <LedgerList
        ledgers={ledgers}
        isLoading={isLoading}
        onNewLedger={() => {
          setDialogOpen(true);
        }}
        onDeleteLedger={deleteLedger}
      />
      <NewLedgerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(name, cashCap) => createLedger({ name, cashCap })}
      />
    </div>
  );
}
