"use client";

import { LedgerList } from "@/components/ledgers";
import { useLedgers } from "@/hooks/use-ledgers";
import { useDeleteLedger } from "@/hooks/use-delete-ledger";
import { useAuth } from "@/hooks/use-auth";

export default function LedgersPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { ledgers, isLoading } = useLedgers(uid);
  const { mutate: deleteLedger } = useDeleteLedger(uid);

  const handleNewLedger = () => {
    // TODO: open new ledger dialog/modal
  };

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <LedgerList
        ledgers={ledgers}
        isLoading={isLoading}
        onNewLedger={handleNewLedger}
        onDeleteLedger={deleteLedger}
      />
    </div>
  );
}
