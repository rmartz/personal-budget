"use client";

import { GoalsListView } from "@/components/goals";
import { useAllSavingsGoals } from "@/hooks/use-all-savings-goals";
import { useAuth } from "@/hooks/use-auth";
import { useLedgersSubscription } from "@/hooks/use-ledgers-subscription";

export default function GoalsPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const {
    goals,
    isLoading: goalsLoading,
    error: goalsError,
  } = useAllSavingsGoals(uid);
  const { ledgers } = useLedgersSubscription(uid);

  if (authLoading || !user) {
    return null;
  }

  const ledgerNames = Object.fromEntries(
    ledgers.map((ledger) => [ledger.id, ledger.name]),
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <GoalsListView
        goals={goals}
        ledgerNames={ledgerNames}
        isLoading={goalsLoading}
        error={goalsError}
      />
    </div>
  );
}
