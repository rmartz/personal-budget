"use client";

import { useRouter } from "next/navigation";
import { use, useMemo } from "react";

import { GoalPurchaseView } from "@/components/goal-purchase";
import { GOAL_PURCHASE_PAGE_COPY } from "@/components/goal-purchase/copy";
import { useAuth } from "@/hooks/use-auth";
import { useLedgersSubscription } from "@/hooks/use-ledgers-subscription";
import { useSavingsGoal } from "@/hooks/use-savings-goal";
import { useSavingsGoals } from "@/hooks/use-savings-goals";
import { useTransactions } from "@/hooks/use-transactions";
import { computeMonthlyDepositRate } from "@/lib/goal-funding";
import { calculateLedgerBalance } from "@/lib/reconciliation/ledger-balance";

interface GoalPurchasePageProps {
  params: Promise<{ goalId: string }>;
}

export default function GoalPurchasePage({ params }: GoalPurchasePageProps) {
  const { goalId } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const {
    goal,
    isLoading: goalLoading,
    error: goalError,
  } = useSavingsGoal(uid, goalId);
  const { ledgers } = useLedgersSubscription(uid);
  const ledgerId = goal?.ledgerId ?? "";
  const { savingsGoals: siblingGoals } = useSavingsGoals(uid, ledgerId);
  const { transactions } = useTransactions(uid, ledgerId);
  const referenceDate = useMemo(() => new Date(), []);

  if (authLoading || goalLoading || !user) {
    return null;
  }

  if (goalError !== undefined) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="text-center text-destructive">
          {GOAL_PURCHASE_PAGE_COPY.errorMessage}
        </p>
      </div>
    );
  }

  if (!goal) {
    return null;
  }

  const budgetLedger = ledgers.find((l) => l.id === goal.ledgerId);
  const ledgerName = budgetLedger?.name ?? goal.ledgerId;
  const { cashBalance: ledgerCashBalance } = calculateLedgerBalance({
    cashCap: budgetLedger?.cashCap,
    transactions,
  });
  const monthlyAllocation = computeMonthlyDepositRate(
    transactions,
    referenceDate,
  );
  const siblings = siblingGoals.filter((g) => g.id !== goal.id);

  function handleSubmit() {
    // TODO: Implement purchase recording in epic #14 (Goal Purchase Flow)
    router.push("/goals");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <GoalPurchaseView
        goal={goal}
        ledgerCashBalance={ledgerCashBalance}
        ledgerName={ledgerName}
        monthlyAllocation={monthlyAllocation}
        referenceDate={referenceDate}
        siblingGoals={siblings}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
