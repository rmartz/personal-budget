import type { ReactNode } from "react";

import { AppShellNav } from "@/components/app-shell";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShellNav>{children}</AppShellNav>;
}
