"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Annuity } from "@/lib/firebase/schema/annuities";
import { ANNUITY_LIST_COPY } from "./copy";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface AnnuityListViewProps {
  annuities: Annuity[];
  isLoading: boolean;
}

export function AnnuityListView({
  annuities,
  isLoading,
}: AnnuityListViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {ANNUITY_LIST_COPY.title}
        </h1>
      </div>

      {isLoading ? (
        <Card>
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
      ) : annuities.length === 0 ? (
        <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
          {ANNUITY_LIST_COPY.emptyStateMessage}
        </p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 text-right">Monthly</th>
                <th className="px-4 py-3 text-right">Term</th>
              </tr>
            </thead>
            <tbody>
              {annuities.map((annuity) => (
                <tr key={annuity.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{annuity.name}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {currencyFormatter.format(annuity.monthlyAmount)}/mo
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {annuity.durationMonths !== undefined
                      ? `${String(annuity.durationMonths)} ${ANNUITY_LIST_COPY.termSuffix}`
                      : ANNUITY_LIST_COPY.indefiniteTerm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
