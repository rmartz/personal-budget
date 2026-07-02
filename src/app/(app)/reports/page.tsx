"use client";

import { useState } from "react";

import { type ReportPeriod, ReportsView } from "@/components/reports";

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("6m");
  return <ReportsView period={period} onPeriodChange={setPeriod} />;
}
