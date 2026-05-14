"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { GOAL_PURCHASE_WARNING_COPY } from "./copy";

export function GoalPurchaseWarning() {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-destructive">
          {GOAL_PURCHASE_WARNING_COPY.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {GOAL_PURCHASE_WARNING_COPY.description}
        </p>
      </CardContent>
    </Card>
  );
}
