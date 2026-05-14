"use client";

import { Card } from "@/components/ui/card";

import { ACCOUNTS_PAGE_COPY } from "./copy";

export interface SetupSummaryRowProps {
  label: string;
  count: number;
  sublabel: string;
}

export function SetupSummaryRow({
  label,
  count,
  sublabel,
}: SetupSummaryRowProps) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-3xl font-bold tabular-nums">
        {ACCOUNTS_PAGE_COPY.configuredCount(count)}
      </p>
      <p className="text-sm text-muted-foreground">{sublabel}</p>
    </Card>
  );
}
