"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAnnuities } from "@/hooks/use-annuities";
import { AnnuityListView, NewAnnuityDialog } from "@/components/annuities";
import { createAnnuity } from "@/services/annuities";

export default function AnnuitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { annuities, isLoading } = useAnnuities(uid);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (authLoading || !user) {
    return null;
  }

  const handleSubmit = async (
    name: string,
    monthlyAmount: number,
    durationMonths: number | undefined,
  ) => {
    await createAnnuity(uid, {
      name,
      monthlyAmount,
      startDate: new Date(),
      durationMonths,
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <AnnuityListView
        annuities={annuities}
        isLoading={isLoading}
        onNewAnnuity={() => {
          setDialogOpen(true);
        }}
      />
      <NewAnnuityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
