"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAnnuities } from "@/hooks/use-annuities";
import { AnnuityListView } from "@/components/annuities";

export default function AnnuitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid ?? "";
  const { annuities, isLoading } = useAnnuities(uid);

  if (authLoading || !user) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <AnnuityListView annuities={annuities} isLoading={isLoading} />
    </div>
  );
}
