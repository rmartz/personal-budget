"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Posture } from "@/lib/firebase/schema/investments";

import { POSTURE_CARD_COPY } from "./copy";
import { INVESTMENTS_PLACEHOLDER_FIXTURE } from "./fixtures";

export interface PostureCardProps {
  posture: Posture;
}

const POSTURE_LABELS: Record<Posture, string> = {
  [Posture.Aggressive]: POSTURE_CARD_COPY.postureAggressive,
  [Posture.Balanced]: POSTURE_CARD_COPY.postureBalanced,
  [Posture.Conservative]: POSTURE_CARD_COPY.postureConservative,
};

const ALL_POSTURES = [
  Posture.Conservative,
  Posture.Balanced,
  Posture.Aggressive,
];

export function PostureCard({ posture }: PostureCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-semibold">
          {POSTURE_CARD_COPY.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex gap-2">
          {ALL_POSTURES.map((p) => (
            <span
              key={p}
              aria-current={p === posture ? "true" : undefined}
              className={
                p === posture
                  ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                  : "rounded-full border px-3 py-1 text-xs text-muted-foreground"
              }
            >
              {POSTURE_LABELS[p]}
            </span>
          ))}
        </div>

        <dl className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {POSTURE_CARD_COPY.targetMargin}
            </dt>
            <dd className="font-mono font-medium">
              {INVESTMENTS_PLACEHOLDER_FIXTURE.targetMargin}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {POSTURE_CARD_COPY.availableMargin}
            </dt>
            <dd className="font-mono font-medium">
              {INVESTMENTS_PLACEHOLDER_FIXTURE.marginAvailable}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              {POSTURE_CARD_COPY.aggregateNet}
            </dt>
            <dd className="font-mono font-medium">
              {INVESTMENTS_PLACEHOLDER_FIXTURE.aggregateNet}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
