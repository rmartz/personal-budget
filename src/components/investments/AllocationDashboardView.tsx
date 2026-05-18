"use client";

import { Bar } from "@/components/ui/bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestmentAccount } from "@/lib/firebase/schema/investments";

import { TARGET_ALLOCATION_COPY } from "./copy";

export interface AllocationDashboardViewProps {
  accounts: InvestmentAccount[];
}

export function AllocationDashboardView({
  accounts,
}: AllocationDashboardViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          {TARGET_ALLOCATION_COPY.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {TARGET_ALLOCATION_COPY.noAccountsConfigured}
          </p>
        ) : (
          <>
            {accounts.map((account) => {
              const deviation = account.currentPercent - account.targetPercent;
              const deviationText =
                deviation > 0
                  ? `+${deviation.toFixed(1)}%`
                  : `${deviation.toFixed(1)}%`;
              return (
                <div key={account.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{account.name}</span>
                    <span
                      className={`font-mono text-xs ${
                        deviation > 0
                          ? "text-orange-500"
                          : deviation < 0
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {deviationText}
                    </span>
                  </div>
                  <div className="relative">
                    <Bar
                      value={account.currentPercent}
                      aria-label={`${account.name} current allocation`}
                    />
                    <div
                      className="absolute inset-y-0 w-0.5 bg-foreground/60"
                      style={{ left: `${String(account.targetPercent)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{account.currentPercent}%</span>
                    <span>{account.targetPercent}%</span>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground">
              {TARGET_ALLOCATION_COPY.footerNote}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
