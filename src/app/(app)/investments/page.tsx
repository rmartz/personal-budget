"use client";

import { useAuth } from "@/hooks/use-auth";
import { useInvestmentAccounts } from "@/hooks/use-investment-accounts";
import { useTargetAllocation } from "@/hooks/use-target-allocation";
import { InvestmentsView } from "@/components/investments";

export default function InvestmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { accounts, isLoading: accountsLoading } = useInvestmentAccounts(uid);
  const {
    allocation,
    posture,
    isLoading: allocationLoading,
  } = useTargetAllocation(uid);

  if (authLoading || !user) {
    return null;
  }

  function handleApplyRebalance() {
    // TODO: Implement rebalance in epic #10 (Investment Margin & Reconciliation Posture)
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <InvestmentsView
        accounts={accounts}
        allocation={allocation}
        posture={posture}
        isLoading={accountsLoading || allocationLoading}
        onApplyRebalance={handleApplyRebalance}
      />
    </div>
  );
}
