"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAnnuities } from "@/hooks/use-annuities";
import { Button } from "@/components/ui/button";
import {
  AnnuityCard,
  AnnuityPaymentHistoryTable,
  AnnuityBalanceTrend,
  CreateAnnuityDialog,
} from "@/components/annuities";
import { ANNUITY_LIST_COPY } from "@/components/annuities/copy";
import { createAnnuity } from "@/services/annuities";
import type { CreateAnnuityInput } from "@/components/annuities";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function AnnuitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { annuities, isLoading } = useAnnuities(uid);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (authLoading || !user) {
    return null;
  }

  const selectedAnnuity =
    annuities.find((a) => a.id === selectedId) ?? annuities[0];
  const totalMonthly = annuities.reduce((sum, a) => sum + a.monthlyAmount, 0);

  const handleSubmit = async (data: CreateAnnuityInput) => {
    await createAnnuity(uid, {
      name: data.name,
      monthlyAmount: data.monthlyAmount,
      monthlyMode: data.monthlyMode,
      startDate: new Date(),
      durationMonths: data.durationMonths,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {ANNUITY_LIST_COPY.title}
          </h1>
          {!isLoading && annuities.length > 0 && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {ANNUITY_LIST_COPY.summaryLine(
                annuities.length,
                currencyFormatter.format(totalMonthly),
              )}
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          {ANNUITY_LIST_COPY.newAnnuityButton}
        </Button>
      </div>

      {!isLoading && annuities.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {ANNUITY_LIST_COPY.emptyStateMessage}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {annuities.map((annuity) => (
              <AnnuityCard
                key={annuity.id}
                annuity={annuity}
                isSelected={annuity.id === selectedAnnuity?.id}
                onSelect={() => {
                  setSelectedId(annuity.id);
                }}
              />
            ))}
          </div>

          {selectedAnnuity !== undefined && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AnnuityPaymentHistoryTable annuity={selectedAnnuity} />
              <AnnuityBalanceTrend annuity={selectedAnnuity} />
            </div>
          )}
        </>
      )}

      <CreateAnnuityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
