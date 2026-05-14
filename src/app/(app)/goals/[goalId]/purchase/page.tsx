"use client";

import { useRouter } from "next/navigation";
import { use } from "react";

import { GoalPurchaseView } from "@/components/goal-purchase";
import { useAuth } from "@/hooks/use-auth";
import { useLedgersSubscription } from "@/hooks/use-ledgers-subscription";
import { useSavingsGoal } from "@/hooks/use-savings-goal";
import { useSavingsGoals } from "@/hooks/use-savings-goals";

interface GoalPurchasePageProps {
  params: Promise<{ goalId: string }>;
}

export default function GoalPurchasePage({ params }: GoalPurchasePageProps) {
  const { goalId } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { goal, isLoading: goalLoading } = useSavingsGoal(uid, goalId);
  const { ledgers } = useLedgersSubscription(uid);
  const ledgerId = goal?.ledgerId ?? "";
  const { savingsGoals: siblingGoals } = useSavingsGoals(uid, ledgerId);

  if (authLoading || goalLoading || !user) {
    return null;
  }

  if (!goal) {
    return null;
  }

  const ledger = ledgers.find((l) => l.id === goal.ledgerId);
  const ledgerName = ledger?.name ?? goal.ledgerId;
  const siblings = siblingGoals.filter((g) => g.id !== goal.id);

  function handleSubmit() {
    // TODO: Implement purchase recording in epic #14 (Goal Purchase Flow)
    router.push("/goals");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <GoalPurchaseView
        goal={goal}
        ledgerName={ledgerName}
        siblingGoals={siblings}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
