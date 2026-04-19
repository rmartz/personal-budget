"use client";

import { LedgerList } from "@/components/ledgers";
import { useLedgers } from "@/hooks/use-ledgers";

// TODO: replace with real uid from auth context once auth is implemented
const PLACEHOLDER_UID = "";

export default function LedgersPage() {
  const { ledgers, isLoading } = useLedgers(PLACEHOLDER_UID);

  const handleNewLedger = () => {
    // TODO: open new ledger dialog/modal
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <LedgerList
        ledgers={ledgers}
        isLoading={isLoading}
        onNewLedger={handleNewLedger}
      />
    </div>
  );
}
