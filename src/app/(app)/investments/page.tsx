"use client";

import { useInvestmentLedgers } from "@/hooks/use-investment-ledgers";
import { InvestmentLedgerList } from "@/components/investments";

export default function InvestmentsPage() {
  // TODO: replace with authenticated user id from auth context
  const uid = "";
  const { ledgers, isLoading } = useInvestmentLedgers(uid);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <InvestmentLedgerList
        ledgers={ledgers ?? []}
        isLoading={isLoading}
        onNewLedger={() => {
          // TODO: open create ledger dialog
        }}
      />
    </main>
  );
}
