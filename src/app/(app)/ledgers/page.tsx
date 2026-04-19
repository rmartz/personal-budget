"use client";

import { LedgerList } from "@/components/ledgers";
import { useLedgers } from "@/hooks/use-ledgers";

// TODO: replace with real uid from auth context once auth is implemented
const PLACEHOLDER_UID = "";

export default function LedgersPage() {
  const { ledgers, isLoading } = useLedgers(PLACEHOLDER_UID);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <LedgerList
        ledgers={ledgers}
        isLoading={isLoading}
        onNewLedger={() => {
          // TODO: open new ledger dialog/modal
        }}
      />
    </div>
  );
}
