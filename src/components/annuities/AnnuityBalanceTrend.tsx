"use client";

import type { Annuity } from "@/lib/firebase/schema/annuities";
import { Card } from "@/components/ui/card";
import { ANNUITY_CARD_COPY } from "./copy";

export interface AnnuityBalanceTrendProps {
  annuity: Annuity;
}

export function AnnuityBalanceTrend({ annuity }: AnnuityBalanceTrendProps) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <h3 className="text-sm font-semibold">
        {ANNUITY_CARD_COPY.balanceTrendTitle(annuity.name.toUpperCase())}
      </h3>
      {/* TODO: Replace with Recharts or similar chart library in epic #16 (Annuity Monthly Tracking) */}
      <div
        role="img"
        aria-label={ANNUITY_CARD_COPY.balanceTrendChartPlaceholder}
        className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted text-sm text-muted-foreground"
      >
        {ANNUITY_CARD_COPY.balanceTrendChartPlaceholder}
      </div>
      <div className="grid grid-cols-3 divide-x text-center text-sm">
        <div className="px-2">
          <p className="text-xs text-muted-foreground">
            {ANNUITY_CARD_COPY.balanceTrendStartedLabel}
          </p>
          <p className="font-medium">
            {ANNUITY_CARD_COPY.balanceTrendPlaceholderValue}
          </p>
        </div>
        <div className="px-2">
          <p className="text-xs text-muted-foreground">
            {ANNUITY_CARD_COPY.balanceTrendNowLabel}
          </p>
          <p className="font-medium">
            {ANNUITY_CARD_COPY.balanceTrendPlaceholderValue}
          </p>
        </div>
        <div className="px-2">
          <p className="text-xs text-muted-foreground">
            {ANNUITY_CARD_COPY.balanceTrendPayoffLabel}
          </p>
          <p className="font-medium">
            {ANNUITY_CARD_COPY.balanceTrendPlaceholderValue}
          </p>
        </div>
      </div>
    </Card>
  );
}
